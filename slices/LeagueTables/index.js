import React, { Fragment, useState, useEffect } from 'react';
import * as prismicH from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import { Flex, Heading, Box, Grid } from '@chakra-ui/react';
import { getPrismicDocByUid } from '../../modules/prismic';
import Slice from '../../components/shared/slice';
import Content from '../../components/shared/content';
import Card from '../../components/shared/card';
import { PrismicNextImage } from '@prismicio/next';

const dividedCellStyles = {
  borderTop: '1px solid',
  borderColor: 'greyLight',
  py: 4,
};

const LeagueTableCard = ({ table }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data && table?.uid) {
      const getTable = async () => {
        const { data } = await getPrismicDocByUid('league_table', table?.uid);

        setData(data);
      };

      getTable();
    }
  }, [data, setData, table?.uid]);

  if (!data) {
    return (
      <Flex flexDirection="column" mb={5}>
        <Card />
      </Flex>
    );
  }

  return (
    <Box
      as="article"
      bg="qukBlue"
      height="100%"
      width="100%"
      borderRadius="xl"
      backgroundImage="/images/league-background.jpg"
      backgroundPosition="center"
      backgroundSize="cover"
      zIndex={0}
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        width="100%"
        height="100%"
        opacity={0.9}
        bg="qukBlue"
        color="white"
        zIndex={1}
        borderRadius="xl"
      />
      <Flex
        position="relative"
        top="0"
        width="100%"
        height="100%"
        bgGradient={`linear(to-tl, ${
          data?.variant ?? 'northernMagenta'
        }, rgba(0, 0, 0, 0))`}
        color="qukBlue"
        px={{ base: 4, sm: 8, md: 9 }}
        pt={4}
        pb={6}
        flexDirection="column"
        textAlign="center"
        borderRadius="xl"
        zIndex={2}
      >
        {data?.logo && <PrismicNextImage field={data?.logo} />}
        {data.title && (
          <Heading
            as="h2"
            mt={2}
            textAlign="center"
            fontFamily="body"
            fontSize={{ base: '2xl', md: '3xl' }}
            color="white"
          >
            {data.title}
          </Heading>
        )}

        <Grid
          gridTemplateColumns="60px auto"
          width="100%"
          borderRadius="lg"
          overflow="hidden"
        >
          {data?.table?.map((item) => (
            <Fragment key={`league-table--${item.position}-${item.team}`}>
              <Box {...dividedCellStyles} bg="white">
                <PrismicRichText field={item.position} />
              </Box>
              <Box {...dividedCellStyles} bg="white" px={2}>
                <PrismicRichText field={item.team} />
              </Box>
            </Fragment>
          ))}
        </Grid>
      </Flex>
    </Box>
  );
};

const LeagueTable = ({ slice }) => {
  const { primary = {}, items = [] } = slice;

  return (
    <Slice variant={primary?.variant}>
      {primary.title && (
        <Heading
          as="h2"
          mt={2}
          textAlign="center"
          fontFamily="body"
          fontSize={{ base: '2xl', md: '3xl' }}
        >
          {primary.title}
        </Heading>
      )}
      {prismicH.asText(primary.content) && (
        <Content pb={3} px={{ base: 4, sm: 8, md: 9 }} textAlign="center">
          <PrismicRichText field={primary.content} />
        </Content>
      )}

      <Grid
        gridTemplateColumns={{
          base: `1fr`,
          md: 'repeat(auto-fill, minmax(300px, 1fr))',
        }}
        gridGap={{ base: 4, md: 9 }}
      >
        {items.map(({ table }, i) => (
          <LeagueTableCard
            table={table}
            key={`league-table-${i}-${table?.id}`}
          />
        ))}
      </Grid>
    </Slice>
  );
};

export default LeagueTable;
