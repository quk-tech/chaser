import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StyledLink } from 'components/latest-news';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { parse } from 'date-fns';
import Router from 'next/router';
import * as Yup from 'yup';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import { Box, Grid, Flex } from 'components';
import Meta from 'components/meta';
import Container from 'components/container';
import Heading from 'components/heading';
import Content from 'components/content';
import Label from 'components/label';
import Button from 'components/button';
import Required from 'components/required';
import { InlineError } from 'components/errors';
import ClubCard, { ACTIVE_STATUS } from 'components/club-card';
import Image from 'components/image';
import { event } from 'modules/analytics';
import { CATEGORIES } from 'constants/analytics';

const SelectClubSchema = Yup.object().shape({
  club_uuid: Yup.string().nullable().required('Required'),
  confirm: Yup.bool().oneOf(
    [true],
    'Please confirm that you have read the disclaimer'
  ),
});

const AutoValidateForm = ({ setSelectedClub, clubs }) => {
  const { values } = useFormikContext();

  useEffect(() => {
    const club = clubs.find(({ uuid }) => uuid === values.club_uuid);
    setSelectedClub(club);
  }, [values, setSelectedClub, clubs]);

  return null;
};

const handleSubmit = async ({ club_uuid }, setSubmitting, setServerError) => {
  try {
    setServerError(null);

    await api.put('/users/me', { club_uuid });

    event({
      category: CATEGORIES.MEMBERSHIP,
      action: 'Club selected',
    });

    setSubmitting(false);
    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
    setSubmitting(false);
  }
};

const Checkbox = ({ field, type, selectedClub, ...labelProps }) => (
  <Label {...labelProps}>
    <input {...field} type={type} /> By checking this box I acknowledge that I
    have read the above disclaimer and I intend for{' '}
    <strong>{selectedClub}</strong> to be my QuidditchUK club for 2020/2021
    Season.
  </Label>
);

const ManageClub = ({ user, clubs = [] }) => {
  const [selectedClub, setSelectedClub] = useState(
    user?.club_uuid ? clubs.find(({ uuid }) => uuid === user.club_uuid) : ''
  );
  const [serverError, setServerError] = useState(null);

  return (
    <>
      <Meta
        description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more"
        subTitle="Manage"
      />
      <Box
        bg="greyLight"
        py={{ base: 4, lg: 10 }}
        px={{ base: 4, sm: 8, md: 9 }}
      >
        <Container>
          <Grid
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gridGap={{ base: 4, md: 9 }}
          >
            <Box
              bg="white"
              py={4}
              px={{ base: 4, sm: 8, md: 9 }}
              borderRadius={1}
            >
              <Heading as="h2" fontFamily="body" color="qukBlue">
                Select your club
              </Heading>

              <Content>
                {user.club_uuid ? (
                  <>
                    <p>
                      You have selected <strong>{selectedClub?.name}</strong> as
                      your QuidditchUK Club.
                    </p>
                    <p>
                      If you need to change your club, you must submit a
                      transfer request to QuidditchUK to request any changes.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Before confirming, please double check that you have
                      selected the correct club and they know you are joining
                      them this competitive season.
                    </p>
                    <p>
                      Please note that once you have chosen and locked in your
                      club you will not be able to undo it, and any changes will
                      have to be requested via a Club Transfer Request to
                      QuidditchUK.
                    </p>
                  </>
                )}
              </Content>

              {!user.club_uuid && (
                <Formik
                  onSubmit={(values, { setSubmitting }) =>
                    handleSubmit(values, setSubmitting, setServerError)
                  }
                  initialValues={{
                    club_uuid: null,
                    confirm: false,
                  }}
                  validationSchema={SelectClubSchema}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <Grid gridTemplateColumns="1fr" mt={5}>
                        <Label htmlFor="club_uuid" mb="2">
                          Select your club <Required />
                        </Label>

                        <Field id="club_uuid" name="club_uuid" as="select">
                          <option disabled selected value>
                            Select a club
                          </option>
                          {clubs.map((club) => (
                            <option key={club.uuid} value={club.uuid}>
                              {club.name}
                            </option>
                          ))}
                        </Field>

                        <ErrorMessage
                          name="club_uuid"
                          component={InlineError}
                          marginBottom={3}
                        />

                        <Field
                          mt="3"
                          name="confirm"
                          type="checkbox"
                          component={Checkbox}
                          selectedClub={selectedClub?.name}
                        />

                        <ErrorMessage
                          name="confirm"
                          component={InlineError}
                          marginBottom={3}
                        />

                        <AutoValidateForm
                          setSelectedClub={setSelectedClub}
                          clubs={clubs}
                        />
                      </Grid>

                      <Button
                        mt="2"
                        type="submit"
                        variant="green"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting' : 'Select my club'}
                      </Button>
                    </Form>
                  )}
                </Formik>
              )}

              {serverError && <InlineError my={3}>{serverError}</InlineError>}
            </Box>
            {selectedClub && (
              <Flex flexDirection="column" key={selectedClub.uuid}>
                <Link
                  href="/clubs/[club]"
                  as={`/clubs/${selectedClub.slug}`}
                  passHref
                >
                  <StyledLink>
                    <ClubCard
                      backgroundColor={selectedClub.featured_color}
                      color={selectedClub.text_color}
                      name={selectedClub.name}
                      league={selectedClub.league}
                      venue={selectedClub.venue}
                      icon={selectedClub.icon}
                      status={selectedClub.status}
                      image={
                        selectedClub.images ? (
                          <Image
                            src={selectedClub.images[0]}
                            alt={selectedClub.name}
                            width={1600}
                            height={900}
                            borderRadius="0px"
                          />
                        ) : null
                      }
                    />
                  </StyledLink>
                </Link>
              </Flex>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const { data: clubs } = await api.get('/clubs/search');
  const { data: user } = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  const { data: products } = await api.get('/products/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  if (
    !products.length ||
    !products.filter(
      (product) =>
        new Date() < parse(product?.metadata?.expires, 'dd-MM-yyyy', new Date())
    ).length
  ) {
    res.setHeader('location', '/dashboard/membership/manage');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: {
      clubs: clubs.filter(({ status }) => status === ACTIVE_STATUS),
      user,
    },
  };
};

export default ManageClub;
