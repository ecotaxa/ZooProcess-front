import * as z from 'zod';
import React, { useState, useTransition } from 'react';

import { LoginSchema } from './schema.ts';
import { Input } from '@heroui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'app/components/form.tsx';
import { CardWrapper } from './components/card-wrapper.tsx';
import { FormError } from 'app/components/form-error.tsx';
import { FormSuccess } from 'app/components/form-success.tsx';
import { login } from './login.ts';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

import { EyeFilledIcon } from './components/EyeFilledIcon.jsx';
import { EyeSlashFilledIcon } from './components/EyeSlashFilledIcon.jsx';

import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { useAuth } from 'app/stores/auth-context.tsx';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { t } = useTranslation('Login');
  const [searchParams] = useSearchParams();
  // TODO, in case there are several protected pages
  // const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? t('AlreadyExist')
      : // ? "Email already in use with a different provider!"
        '';
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values)
        .then(token => {
          authLogin(token);
          setSuccess('Logged!');
          setTimeout(() => navigate('/dashboard'), 1000);
        })
        .catch(error => {
          setError(error.message);
        });
    });
  };

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <CardWrapper headerLabel={t('Welcome')} backButtonLabel="" backButtonHref="/auth/register">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Password')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={t('EnterPassword')}
                      // type="password"
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                      type={isVisible ? 'text' : 'password'}
                      // className="flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      // className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                  {/*<Link href="/auth/reset" size="sm" color="primary">*/}
                  {/*  {t('ForgotPassword')}*/}
                  {/*</Link>*/}
                </FormItem>
              )}
            />
          </div>
          <FormError message={error ?? urlError} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {t('Login')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
