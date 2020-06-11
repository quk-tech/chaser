/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space } from 'styled-system';
import Link from 'next/link';
import { format } from 'date-fns';
import { parseTimestamptz } from 'modules/dates';
import { Box, Flex, Grid } from 'components/layout';
import Heading from 'components/heading';
import Button from 'components/button';
import ExternalLink from 'components/external-link';
import Type, { TYPES } from 'components/club-type';
import { rem } from 'styles/theme';

const StyledCard = styled(Grid)`
  border-radius: ${({ theme }) => theme.radius[1]};
  overflow: hidden;
  transition: box-shadow 0.125s;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};

  ${space};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.box};
  }
`;

const IconContainer = styled.div`
  padding: ${({ theme }) => theme.space[4]};
`;

const Icon = styled.img`
  border-radius: 50%;
  height: 75px;
  width: 75px;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.black};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const EventCard = ({
  image,
  name,
  league,
  icon,
  venue,
  startTime,
  slug,
  registerLink,
  registerTime,
  ...cardProps
}) => (
  <StyledCard
    {...cardProps}
    gridTemplateColumns={{ _: '1fr', m: '3fr 6fr 3fr' }}
    gridGap={{ _: 'gutter._', m: 'gutter.m' }}
  >
    <Box
      as="section"
      position="relative"
      backgroundImage={`url(${image})`}
      backgroundColor="primary"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Flex
        position="absolute"
        zIndex={1}
        bg={TYPES[league]}
        opacity={0.2}
        width="100%"
        height="100%"
      />

      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        zIndex={2}
        height="100%"
      >
        <IconContainer><Icon src={icon} alt={`${name} logo`} /></IconContainer>
      </Flex>
    </Box>

    <Content>
      <Type fontWeight="bold" fontSize={(rem(10))} bg={TYPES[league]}>{league}</Type>
      <Heading as="h2" fontSize={3} isBody>{name}</Heading>
      <p>
        <strong>{format(parseTimestamptz(startTime), 'EEE, d LLL H:mm a')}</strong><br />
        {venue}
      </p>
    </Content>

    <Flex flexDirection="column" justifyContent="center" alignItems="center" padding="3">
      {registerLink && new Date() < parseTimestamptz(registerTime) && (<ExternalLink href={registerLink}><Button type="button" variant="primary" mb="3" width="1">Register</Button></ExternalLink>)}
      <Link href="/events/[event]" as={`/events/${slug}`}><a><Button type="button" variant="light" width="1">Read More</Button></a></Link>
    </Flex>
  </StyledCard>
);

EventCard.defaultProps = {
  name: null,
  league: null,
  image: null,
  venue: null,
  icon: null,
  startTime: null,
  slug: null,
  registerLink: null,
  registerTime: null,
};

EventCard.propTypes = {
  name: PropTypes.string,
  league: PropTypes.string,
  venue: PropTypes.string,
  icon: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string,
  startTime: PropTypes.string,
  registerLink: PropTypes.string,
  registerTime: PropTypes.string,
};

export default EventCard;
