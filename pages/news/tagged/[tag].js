import { useState, useEffect } from 'react';
import Prismic from 'prismic-javascript';
import dynamic from 'next/dynamic';
import { useInfiniteQuery } from 'react-query';
import { Flex } from '@chakra-ui/react';
import { getBlogTags, PAGE_SIZE, Client } from 'modules/prismic';
import { LoadMore } from 'pages/news';

const LatestNews = dynamic(() => import('components/latest-news'));
const NewsHeader = dynamic(() => import('components/news-header'));
const Meta = dynamic(() => import('components/meta'));

const unDasherizeTag = (tag) => tag.replace(/--/g, ' ').replace(/__/g, '/');

const getPagedDocs = ({ pageParam = 0, tag }) => {
  return Client().query(
    [
      Prismic.Predicates.at('document.type', 'post'),
      Prismic.Predicates.any('document.tags', [unDasherizeTag(tag)]),
    ],
    {
      orderings: '[my.post.date desc]',
      pageSize: PAGE_SIZE,
      page: pageParam,
    }
  );
};

const News = ({ posts: initialPosts = [], tag = '' }) => {
  const [showLoadMore, setShowLoadMore] = useState(true);

  const { data, isFetching, fetchNextPage } = useInfiniteQuery(
    ['news', 'tagged', tag],
    ({ pageParam }) => getPagedDocs({ pageParam, tag }),
    {
      getNextPageParam: (lastPage) => lastPage.page + 1,
    }
  );

  const posts =
    data?.pages?.reduce((acc, { results }) => acc.concat(results), []).flat() ||
    initialPosts;

  useEffect(() => {
    if (posts?.length % PAGE_SIZE !== 0) {
      setShowLoadMore(false);
    }
  }, [posts]);

  return (
    <>
      <Meta
        subTitle={unDasherizeTag(tag)}
        description={`All news tagged ${unDasherizeTag(tag)}`}
      />
      <NewsHeader />
      <LatestNews
        tag={unDasherizeTag(tag)}
        posts={posts}
        horizontalScroll={false}
      />
      {isFetching && (
        <Flex
          alignItems="center"
          justifyContent="center"
          py={5}
          color="qukBlue"
        >
          Loading...
        </Flex>
      )}

      {showLoadMore && !isFetching && (
        <LoadMore fetchNextPage={fetchNextPage} />
      )}
    </>
  );
};

export const getServerSideProps = async ({ params: { tag } }) => {
  const posts = await getBlogTags([unDasherizeTag(tag)], {
    orderings: '[my.post.date desc]',
    pageSize: PAGE_SIZE,
  });

  return {
    props: { posts, tag },
  };
};

export default News;
