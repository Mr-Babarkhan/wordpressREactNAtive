// PostList.js
import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { encode } from 'base-64';
import axios from 'axios';

// Define an interface for the post data
interface Post {
  date_gmt: any;
  date: ReactNode;
  yoast_head_json: any;
  og_image: any;
  _embedded: any;
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

// ...

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

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
            _embed: true, // Embed additional data
          },
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });

        // console.log(response);
        setPosts(response.data);
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
          <View style={{ marginBottom: 10, borderBottomWidth: 1, padding: 10 ,alignItems:'center'}}>
             {item.yoast_head_json && item.yoast_head_json.og_image && item.yoast_head_json.og_image[0]?.url && (
              <Image
                source={{ uri: item.yoast_head_json.og_image[0].url }}
                style={{ width: 350, height: 150, marginVertical: 10 }}
              />
            )}
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title.rendered}</Text>

  <View style={{ flexDirection: 'row' }}>
  <Text style={{ fontSize: 16, fontWeight: 'bold' ,marginRight:130}}>
    {item._embedded?.author?.[0]?.name || 'Unknown Author'}
  </Text>
  <Text style={{ fontWeight: '600' }}>
    {new Date(item.date_gmt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}
  </Text>
</View>

           
          </View>
        )}
      />
    </View>
  );
};

export default PostList;
