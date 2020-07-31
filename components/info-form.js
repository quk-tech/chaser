import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Box, Grid } from 'components/layout';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';

import Input from 'components/input';
import Label from 'components/label';
import Button from 'components/button';
import Toggle from 'components/toggle';
import { InlineError } from 'components/errors';
import Content from 'components/content';
import { api } from 'modules/api';
import Required from 'components/required';

const InfoFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  first_name: Yup.string().required('Please enter the first name you go by'),
  last_name: Yup.string().required('Please enter the last name you go by'),
  is_student: Yup.bool().required(),
  university: Yup.string().when('is_student', {
    is: true,
    then: Yup.string().required('We need your university for X reason'),
    otherwise: Yup.string(),
  }),
});

const handleInfoSubmit = async (values, setServerError, setServerSuccess) => {
  const data = { ...values, university: values.university || null };

  try {
    setServerError(null);
    setServerSuccess(null);

    await api.put('/users/me', data);

    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const InfoForm = ({ user }) => {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    formState,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(InfoFormSchema),
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_student: user.is_student,
      university: user.university,
    },
  });

  const { isSubmitting } = formState;

  const watchIsStudent = watch('is_student');
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        setServerSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => { };
  }, [serverSuccess]);

  return (
    <>
      <form onSubmit={handleSubmit((values) => handleInfoSubmit(values, setServerError, setServerSuccess))}>
        <Grid gridTemplateColumns="1fr">
          <Label htmlFor="name">
            Email Address
          </Label>

          <Input
            name="email"
            placeholder="Your email address"
            ref={register}
            my={3}
            error={errors.email}
          />

          {errors.email && (<InlineError marginBottom={3}>{errors.email.message}</InlineError>)}

          <Label htmlFor="first_name">
            Preferred first name <Required />
          </Label>

          <Input
            name="first_name"
            placeholder="First name"
            ref={register}
            my={3}
            type="first_name"
            error={errors.first_name}
          />

          {errors.first_name && (<InlineError marginBottom={3}>{errors.first_name.message}</InlineError>)}

          <Label htmlFor="last_name">
            Preferred last name <Required />
          </Label>

          <Input
            name="last_name"
            placeholder="Last name"
            ref={register}
            my={3}
            type="last_name"
            error={errors.last_name}
          />
          {errors.last_name && (<InlineError marginBottom={3}>{errors.last_name.message}</InlineError>)}

          <Label htmlFor="is_student">Are you a student? <Required /></Label>

          <Toggle my={3} name="is_student" ref={register} />

          {watchIsStudent && (
            <>
              <Label htmlFor="last_name">
                What university do you attend? <Required />
              </Label>

              <Input
                name="university"
                placeholder="Name of your university"
                ref={register}
                my={3}
                type="university"
                error={errors.university}
              />
              {errors.university && (<InlineError marginBottom={3}>{errors.university.message}</InlineError>)}
            </>
          )}

        </Grid>
        <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Update Info'}</Button>
      </form>

      {serverError && (
        <>
          <InlineError my={3}>{serverError}</InlineError>
        </>
      )}

      {serverSuccess && (
        <Box bg="primary" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="white" borderRadius={0}>
          <Content>User updated</Content>
        </Box>
      )}
    </>
  );
};

InfoForm.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    is_student: PropTypes.bool,
    university: PropTypes.string,
  }).isRequired,
};

export default InfoForm;