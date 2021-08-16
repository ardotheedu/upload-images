import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface ImageData {
  title: string;
  description: string;
  url: string;
  id: string;
}

interface ImagesQueryResponse {
  after?: {
    id: string;
  };
  data: {
    data: {
      title: string;
      description: string;
      url: string;
    };
    ts: number;
    ref: {
      id: string;
    };
  }[];
}

export default function Home(): JSX.Element {
  const fetchProjects = ({ pageParam = null }) => api.get<ImagesQueryResponse>('/api/images', {
    params: {
      after: pageParam,
    }
  });
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // (DONE) AXIOS REQUEST WITH PARAM
    fetchProjects,
    {
      // (DONE) GET AND RETURN NEXT PAGE PARAM
      getNextPageParam: (lastPage, pages) =>  {
        return lastPage.data.after || null;
      }
    }
  );
  
  const dataa = {
    "pages": [
      {
        "data": [
          {
            "data": {
              "title": "Doge",
              "description": "The best doge",
              "url": "https://i.ibb.co/K6DZdXc/minh-pham-LTQMgx8t-Yq-M-unsplash.jpg",
            },
            "ref": {
              "id": "294961059684418048"
            },
              "ts": 1620222828340000,
          },
          {
            "data": {
              "title": "Doge",
              "description": "The best doge",
              "url": "https://i.ibb.co/K6DZdXc/minh-pham-LTQMgx8t-Yq-M-unsplash.jpg",
            },
            "ref": {
              "id": "294961059684418048"
            },
              "ts": 1620222828340000,
          },
          {
            "data": {
              "title": "Doge",
              "description": "The best doge",
              "url": "https://i.ibb.co/K6DZdXc/minh-pham-LTQMgx8t-Yq-M-unsplash.jpg",
            },
            "ref": {
              "id": "294961059684418048"
            },
              "ts": 1620222828340000,
          },
        ],
        "after": "295991160078336512"
      }
    ],
  }


  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    return dataa.pages[0].data.map((image) => {
      return {
        title: image.data.title,
        description: image.data.description,
        url: image.data.url,
        id: image.ref.id,
        ts: image.ts,
      };
    }).flat()

  }, [data]);

  

  // TODO RENDER LOADING SCREEN

  // if (isLoading) {
  //   return <Loading />;
  // }

  // TODO RENDER ERROR SCREEN

  // if (isError) {
  //   return <Error />;
  // }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
