import React, { useState } from "react"
import { graphql } from 'gatsby'
import { StaticImage } from "gatsby-plugin-image"

const IndexPage = ({ data }) => {
  const messages = data.allAirtable.nodes  

  const FuncJamLogo = () => (
    <StaticImage
      src="../images/Gatsby_FuncJam__Landing_page_logo.png"
      alt="Gatsby FuncJam Logo"
      placeholder="blurred"
      className="w-72"
    />
  ) 

  return (
    <div className="container mx-auto px-72">
      <main className="py-16">
        <header className="flex pb-16">
          <FuncJamLogo />
          <div className="flex-1 pl-8">
            <h1 className="mt-4 text-5xl">Discord <span className="font-bold">Board</span></h1>
            <p className="mt-4 font-primary">A silly little project that uses Gatsby Functions to save chat messages from Discord.</p>
            <a className="inline-block px-4 py-2 mt-8 text-white rounded-md bg-discord-blurple hover:no-underline" href="https://discord.gg/tV2sPMawqz" target="_blank" rel="noreferrer">Join the Discord</a>
          </div>
        </header>
        {messages.map(message => {
          const authorData = JSON.parse(message.data.Author_Data)
          const replyData = JSON.parse(message.data.Reply_Data)

          return (
          <article key={message.data.Message_ID} className="w-auto p-4 mx-8 mb-8 rounded-lg bg-discord-bg-primary">
            <div className="flex">
              <img className="self-end h-full rounded-full" src={authorData.Avatar} alt="Avatar" width="40" height="40" />
              <div className="w-full ml-4">
                { replyData?.Content && (
                <div className="relative flex text-xs text-discord-header-secondary">
                  <div className="flex items-center">
                    <img className="h-full rounded-full" src={replyData.Author.Avatar} alt="Avatar" width="20" height="20" />
                    <div className="ml-1">
                      <div>
                        <span className="mr-2 font-bold font-primary">{replyData.Author.Username}</span>
                        {replyData.Content}
                      </div>
                    </div>
                  </div>
                </div>
              )}
                <a href={message.data.Message_URL} className="block hover:no-underline">
                  <div className="flex items-center mt-2">
                    <span className="font-bold text-white font-primary">{authorData.Username}</span>
                    <span className="ml-2 text-xs text-discord-text-muted">{message.data.Date}</span>
                  </div>
                  <div className="text-white whitespace-pre-line">
                    {message.data.Message_Content}
                  </div>
                </a>
              </div>
            </div>
          </article>
        )})}
      </main>
      <footer className="pb-8 text-center">Created by <a href="https://laneparton.com">Lane Parton</a> for <a href="https://www.gatsbyjs.com/func-jam-21/">Gatsby FuncJam21</a></footer>
    </div>
  )
}

export default IndexPage

export const query = graphql`
  query MyQuery {
    allAirtable {
      nodes {
        data {
          Reply_Data
          Message_ID
          Message_Content
          Message_URL
          Date
          Author_Data
        }
      }
    }
  }
`;

