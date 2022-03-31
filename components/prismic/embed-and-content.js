import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';
import { Grid, Flex, Heading, Text, Box } from '@chakra-ui/react';

import { linkResolver } from 'modules/prismic';
import { buttonVariants } from 'components/shared/slice';

const Slice = dynamic(() => import('components/shared/slice'));
const Button = dynamic(() => import('components/shared/button'));
const Content = dynamic(() => import('components/shared/content'));

const Embed = dynamic(() =>
  import('components/prismic/embeds').then(({ Embed }) => Embed)
);

const Item = ({ item, isEmbedLeft }) => (
  <Grid
    gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
    gridGap={{ base: 4, md: 9 }}
  >
    <Flex
      direction="column"
      justifyContent="center"
      order={{ base: 2, md: `${isEmbedLeft ? 2 : 1}` }}
    >
      {RichText.asText(item.title) && (
        <Heading as="h2" fontSize="xl" mt={2}>
          {RichText.asText(item.title)}
        </Heading>
      )}

      {item.content && (
        <Content>
          <RichText render={item.content} linkResolver={linkResolver} />
        </Content>
      )}

      {item.cta_text && (
        <Box>
          <Button
            type="button"
            variant={buttonVariants[item.variant]}
            ml={2}
            href={item.cta_url}
          >
            {item.cta_text}
          </Button>
        </Box>
      )}
    </Flex>

    <Flex
      direction="column"
      justifyContent="center"
      order={{ base: 1, md: `${isEmbedLeft ? 1 : 2}` }}
    >
      <Embed embed={item.embed} />
      {RichText.asText(item.support) && (
        <Text textAlign="center" pt={2} fontStyle="italic">
          <RichText render={item.support} />
        </Text>
      )}
    </Flex>
  </Grid>
);

const EmbedAndContent = ({ items }) => (
  <>
    {items.map((item, i) => (
      <Slice variant={item?.variant} key={`embed-and-content-${i}`}>
        <Item item={item} isEmbedLeft={item.layout_content === 'embed-left'} />
      </Slice>
    ))}
  </>
);

export default EmbedAndContent;
