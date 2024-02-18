import React from 'react';
import Header from "../../common/components/Header";
import styled from "styled-components";
import VideoCard from "./components/VideoCard";

const Main = styled.main`
    padding: 0 15%;
    height: calc(100vh - 69px);
    overflow: hidden;

    @media (max-width: 640px) {
        padding: 0;
    }
`

const Section = styled.section`
    display: flex;
    overflow: auto;
    flex-wrap: wrap;
    padding: 20px 0;

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;

    }
`

const date = new Date()
date.setSeconds(date.getSeconds() - 1)

const Home = () => {
    const arr = []
    for (let i = 0; i < 5; i++) {
        arr.push(<VideoCard videoId={"Asd"} alt={"Asd"}
                            src={"https://i.ytimg.com/vi/x-NtIC3e0Ds/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdQsCI5B3RtPUJn0Put9MWOhu83g"}
                            nickname={"asd"} createdAt={date} email={"asd"}/>)
    }
    return (
        <>
            
            <Header/>
            <Main>
                <Section>
                    {arr}
                </Section>
            </Main>
        </>
    );
}

export default Home;