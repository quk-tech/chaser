import dynamic from 'next/dynamic';

// import CATEGORIES from 'constants/categories';
import { Flex, Box, Heading } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const Button = dynamic(() => import('components/button'));
const Card = dynamic(() => import('components/card'));
const Container = dynamic(() => import('components/container'));
const HorizontalScrollWrapper = dynamic(() =>
  import('components/horizontal-scroll-wrapper')
);

const News = ({
  posts = [],
  category,
  horizontalScroll = true,
  showAllNewsButton = true,
  tag,
}) => {
  return (
    <Box bg="greyLight" py={{ base: 6, lg: 10 }} px={{ base: 0, md: 9 }}>
      <Container>
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mr={{ base: 6, md: 0 }}
          mt="-1.5rem"
        >
          <Heading
            as="h2"
            fontSize="2xl"
            px={{ base: 8, md: 0 }}
            color="qukBlue"
            fontFamily="body"
          >
            {category || tag || 'Latest'} News
          </Heading>

          {showAllNewsButton && (
            <Button
              href="/news"
              variant="transparent"
              borderColor="qukBlue"
              color="qukBlue"
              _hover={{ bg: 'gray.300' }}
              rightIcon={<ArrowForwardIcon />}
            >
              All News
            </Button>
          )}
        </Flex>

        <HorizontalScrollWrapper
          itemsCount={posts?.length}
          horizontalScroll={horizontalScroll}
        >
          {posts.map(({ uid, data }) => (
            <Flex flexDirection="column" key={uid}>
              <Card
                title={data.title}
                href={`/news/${uid}`}
                ariaLabel={data?.title}
                category={data.category}
                image={{
                  src: data?.image?.url,
                  alt: data?.image?.alt,
                  height: data?.image?.height,
                  width: data?.image?.width,
                }}
              />
            </Flex>
          ))}
        </HorizontalScrollWrapper>
      </Container>
    </Box>
  );
};

export default News;
