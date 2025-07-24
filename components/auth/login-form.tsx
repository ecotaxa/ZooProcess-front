import * as z from 'zod';
import { useForm } from 'react-hook-form';
import React from 'react';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginSchema } from '@/schemas';
import { Input } from '@heroui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CardWrapper } from '@/components/auth/card-wrapper';
// import { Button } from "@/components/ui/button";
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { login } from '@/actions/login';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

import { EyeFilledIcon } from './EyeFilledIcon';
import { EyeSlashFilledIcon } from './EyeSlashFilledIcon';

import { cn } from '@/lib/utils';

export const LoginForm = () => {
  const t = useTranslations('Login');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? t('AlreadyExist')
      : // ? "Email already in use with different provider!"
        '';

  // const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // console.log(values)
    // login(values)

    setError('');
    setSuccess('');

    startTransition(() => {
      login(values).then(data => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });

    // startTransition(() => {
    //   login(values, callbackUrl)
    //     .then((data) => {
    //       if (data?.error) {
    //         form.reset();
    //         setError(data.error);
    //       }

    //       if (data?.success) {
    //         form.reset();
    //         setSuccess(data.success);
    //       }

    //       // if (data?.twoFactor) {
    //       //   setShowTwoFactor(true);
    //       // }
    //     })
    //     .catch(() => setError("Something went wrong"));
    // });
  };

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <CardWrapper
      // headerLabel="Welcome back"
      // backButtonLabel="Don't have an account?"
      headerLabel={t('Welcome')}
      backButtonLabel={t('BackButtonLabel')}
      backButtonHref="/auth/register"
    >
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
                  <Link href="/auth/reset" size="sm" color="primary">
                    {t('ForgotPassword')}
                  </Link>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {t('Login')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
