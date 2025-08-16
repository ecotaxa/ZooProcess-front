import * as z from 'zod';
import React, { useState, useTransition } from 'react';

import { Input } from '@heroui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'app/components/form.tsx';
import { FormError } from 'app/components/form-error.tsx';
import { FormSuccess } from 'app/components/form-success.tsx';
import { Button } from '@heroui/button';

import { EyeFilledIcon } from '../login/components/EyeFilledIcon.jsx';
import { EyeSlashFilledIcon } from '../login/components/EyeSlashFilledIcon.jsx';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Schema for EcoTaxa login validation
const EcoTaxaLoginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type EcoTaxaCredentials = z.infer<typeof EcoTaxaLoginSchema>;

interface EcoTaxaLoginFormProps {
  onSubmit: (credentials: EcoTaxaCredentials) => void;
}

export const EcoTaxaLoginForm: React.FC<EcoTaxaLoginFormProps> = ({ onSubmit }) => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EcoTaxaLoginSchema>>({
    resolver: zodResolver(EcoTaxaLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof EcoTaxaLoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      onSubmit(values);
    });
  };

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Connect to EcoTaxa</h2>
      <p className="text-gray-600 mb-6 text-center">
        Please enter your EcoTaxa credentials to upload data
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Email address"
                      type="text"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Your EcoTaxa password"
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Connect to EcoTaxa
          </Button>
        </form>
      </Form>
    </div>
  );
};
