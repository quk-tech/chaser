import { RichText, Link } from 'prismic-reactjs';
import get from 'just-safe-get';
import { cardVariants } from 'components/prismic-wrapper';
import dynamic from 'next/dynamic';

import { Flex, Heading, Box } from '@chakra-ui/react';

const PrismicWrapper = dynamic(() => import('components/prismic-wrapper'));
const Card = dynamic(() => import('components/card'));
const HorizontalScrollWrapper = dynamic(() =>
  import('components/horizontal-scroll-wrapper')
);

import { linkResolver } from 'modules/prismic';

const CardsSlice = (rawData) => {
  const title = get(rawData, 'primary.title');
  const content = get(rawData, 'primary.content');
  const variant = get(rawData, 'primary.variant');
  const items = get(rawData, 'items') || [];
  const horizontalScroll = get(rawData, 'primary.horizontalScroll');

  return (
    <PrismicWrapper
      variant={variant}
      px={horizontalScroll ? { base: 0, md: 9 } : { base: 4, sm: 8, md: 9 }}
    >
      {RichText.asText(title) && (
        <Heading
          as="h2"
          mt={2}
          textAlign="center"
          px={horizontalScroll ? { base: 4, sm: 8, md: 9 } : { base: 0, md: 9 }}
        >
          {RichText.asText(title)}
        </Heading>
      )}

      {content && (
        <Box
          textAlign="center"
          pb={3}
          px={horizontalScroll ? { base: 4, sm: 8, md: 9 } : { base: 0, md: 9 }}
        >
          <RichText render={content} linkResolver={linkResolver} />
        </Box>
      )}

      <HorizontalScrollWrapper
        horizontalScroll={horizontalScroll}
        itemsCount={items?.length}
      >
        {items.map((item, i) => {
          const { title, content, image, link } = item;

          const linkProps = Link.url(link, linkResolver)
            ? {
                href: Link.url(link, linkResolver),
                target: link.target,
                ariaLabel: title,
                ...(link.target === '_blank' && {
                  rel: 'noopener noreferrer',
                }),
              }
            : null;

          return (
            <Flex
              flexDirection="column"
              key={`cards-${i}-${item?.title}-${item?.content}`}
            >
              <Card
                {...linkProps}
                title={title}
                content={content}
                variant={cardVariants[variant]}
                image={{
                  src: image.url,
                  alt: image.alt,
                  height: image.height,
                  width: image.width,
                }}
              />
            </Flex>
          );
        })}
      </HorizontalScrollWrapper>
    </PrismicWrapper>
  );
};

export default CardsSlice;
