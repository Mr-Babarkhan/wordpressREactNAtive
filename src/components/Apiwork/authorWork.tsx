// PostList.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { encode } from 'base-64';
import axios from 'axios';

// Define an interface for the post data
interface Post {
  yoast_head: any;
  author: any;
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  // Add any other properties you expect from the API response
}
const PostList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [authors, setAuthors] = useState<{ [key: number]: string }>({}); // Store author names by ID
  
    useEffect(() => {
      // Fetch data from the WordPress API
      const fetchData = async () => {
        try {
          const username = 'Temp1234';
          const password = 'sp6%66WgoT$UXKkSAIm@(0l*';
  
          const base64Credentials = encode(`${username}:${password}`);
  
          const response = await axios.get('https://dexwirenews.com/wp-json/wp/v2/posts', {
            params: {
              per_page: 100, // Set the number of posts to retrieve
            },
            headers: {
              Authorization: `Basic ${base64Credentials}`,
            },
          });
  
          setPosts(response.data);
  
          // Extract author IDs from posts
          const authorIds = response.data.map((post: { author: any; }) => post.author);
  
          // Fetch author details for each author ID
          const authorDetailsPromises = authorIds.map(async (authorId: any) => {
            const authorResponse = await axios.get(
              `https://dexwirenews.com/wp-json/wp/v2/users/${authorId}`,
              {
                headers: {
                  Authorization: `Basic ${base64Credentials}`,
                },
              }
            );
            return { id: authorId, name: authorResponse.data.name };
          });
  
          // Resolve all author details promises
          const authorDetails = await Promise.all(authorDetailsPromises);
  
          // Convert author details to a dictionary (ID => Name)
          const authorNames = authorDetails.reduce((acc, author) => {
            acc[author.id] = author.name;
            return acc;
          }, {});
  
          setAuthors(authorNames);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <View>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
          WordPress Posts
        </Text>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10, borderBottomWidth: 1, padding: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title.rendered}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {authors[item.author] || 'Unknown Author'}
              </Text>
            </View>
          )}
        />
      </View>
    );
  };
  
  export default PostList;
  