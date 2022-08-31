import React, { useEffect } from "react"
import Layout from "../components/layout"
import Twitter from "../components/twitter"
import CarouselCard from "../components/CarouselCard"
import CategoryCard from "../components/CategoryCard";
import { Badge } from '@mantine/core';
import Card1 from "./../components/vertical-card";
// import Card from "./../components/card";
import Seo from "../components/seo"
import dynamic from "next/dynamic";
import { fetchAPI } from "../lib/api"
import { IconSun, IconMoonStars, IconPlus } from '@tabler/icons';

import { createStyles, Card, ScrollArea, useMantineColorScheme, Grid, Container, Text, Skeleton, Paper, Drawer, useMantineTheme, Anchor,SimpleGrid, Group, ActionIcon  } from '@mantine/core';
// import { useEffect, useState } from "react";


const useStyles = createStyles((theme) => ({
  bg:{
    // boxShadow:" 0 0 0 1px rgba(23,23,23,0.05)",
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  bg_hovered: {
      padding: theme.spacing.md,
      width:"100%",
      backgroundColor:"rgb(245,245,245)",
      boxShadow:"inset 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
    },  
    title: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      fontWeight: 900,
      marginBottom: theme.spacing.md,
      textAlign: 'left',
      marginLeft:"25px",
      color:theme.colorScheme === 'dark' ? "white" : "black",
      [theme.fn.smallerThan('sm')]: {
        fontSize: 28,
        textAlign: 'left',
      }
    },
     titlesmall:{
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      fontWeight: 900,
      marginBottom: theme.spacing.md,
      textAlign: 'left',
      
      // marginLeft:"25px",
  
      [theme.fn.smallerThan('sm')]: {
        fontSize: 28,
        textAlign: 'left',
    }
  },
    badge:{
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease, transform 100ms ease',
      cursor:"pointer",
    '&:hover': {
      boxShadow: `${theme.shadows.md} !important`,
      transform: 'scale(1.05)',
    },
  },
  mainSection:{
    width: "91%",
    // overflow: "auto",
    height: "98vh",
    display: "inline-block",
    marginLeft: "8%",
    marginRight: "1%",
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    marginBottom: "5px",
    marginTop: "5px",
    marginBottom: "5px",
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  card:{
    width:"100%"
  },
  main:{
    borderRadius:"25px",
    // backgroundColor:theme.colorScheme === 'dark' ? "white" : "black",
    // borderColor:"yellow",
    border:"0px solid yellow",
    // baorderTop:"0px"
  }
}));


const Header = dynamic(() => 
import("../components/header.js")
);

const Home = ({ articles, categories, homepage }) => {
  const leftArticlesCount = Math.ceil(articles.length / 5)
  const leftArticles =  articles.slice(leftArticlesCount, articles.length)
  const rightArticles = articles.slice(0, leftArticlesCount)
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
 
  // useEffect(() => {
  //   if(colorScheme === 'dark'){
  //     document.getElementById('__next').style.backgroundColor = "#1A1B1E"
  //     document.getElementById('__next').style.borderRadius = "0px"
  //   }else {
  //     document.getElementById('__next').style.backgroundColor = "black"
  //   }

  // })

  return (
    <>
    <div className={classes.main}>
    {/* <Header categories={categories} /> */}
    <Seo seo={homepage.attributes.seo} />
      <div className={classes.mainSection}>

      <ScrollArea  className="uk-container uk-container-large">
          <Container my="lg" style={{minWidth:"100%", padding:"0px!important"}}>
            <Grid>
              <Grid.Col xs={9}>
                <CarouselCard categories={articles} />
                <h1 className={classes.title}>Latest Posts</h1>
                {leftArticles.map((article, i) => {
                  return (
                    <Card1
                      article={article}
                      articles={articles}
                    />
                  )
                })}
              </Grid.Col>
              <Grid.Col xs={0.1} style={{display:"flex", justifyContent:"center"}}>
                <div className="vl"></div>
              </Grid.Col>
              <Grid.Col xs={2.8}>
                <Paper height={200} mt={6} radius="sm" />
                  <div style={{height:"100%"}}>
                  <div className="badges">
                    <Grid grow>
                        {categories.map((item) => {
                            {return <Grid.Col span={3}><Badge className={classes.badge}>{item.attributes.name}</Badge></Grid.Col>
                               }
                          })}
                    </Grid>
                  </div>
                <Card withBorder radius="md" className={classes.card}>
                  <Group position="apart">
                    <Text className={classes.titlesmall}>Services</Text>
                    <Anchor size="xs" color="dimmed" sx={{ lineHeight: 1 }}>
                      + 21 other services
                    </Anchor>
                  </Group>
                  <SimpleGrid cols={3} mt="md">
                    <CategoryCard categories={categories}/>
                  </SimpleGrid>
                </Card>
                    {/* twitter */}
                  <Twitter style={{position:"sticky", top:"80px", width:"100%", padding:"0px  "}} />
                  </div>
                </Grid.Col>          
            </Grid>
          </Container>
        </ScrollArea>
      </div>
    </div>
     
     </>
  )
}


export async function getStaticProps({params}) {
  // Run API calls in parallel
  const [articlesRes, homepageRes] = await Promise.all([
    fetchAPI("/articles", { populate: "*" }),
    // fetchAPI("/categories", { populate: "*" }),
    fetchAPI("/homepage", {
      populate: {
        hero: "*",
        seo: { populate: "*" },
      },
    }),
    
  ])
  const matchingCategories = await fetchAPI("/categories", {
    // filters: { slug: params.slug },
    populate: {
      articles: {
        populate: "*",
      },
    },
  })
  const allCategories = await fetchAPI("/categories")



  return {
    props: {
      articles: articlesRes.data,
      // categories: categoriesRes.data,
      homepage: homepageRes.data,
      category: matchingCategories.data[0],
      categories: allCategories.data,
    },
    
    revalidate: 1,
  }

 
  
}

export default Home
