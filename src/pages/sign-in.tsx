import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { getCsrfToken, signIn } from "next-auth/react";
import Layout from "~/layout";

/**
 * Schema can be defined on a shared folder
 * in order to be accessed by both client and server.
 */
const schema = z.object({
  nim: z.string().length(8),
  password: z.string().min(8).max(32),
});

type FormValues = z.infer<typeof schema>;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken,
    },
  };
}

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nim: "13520065",
      password: "13520065",
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { nim, password } = data;

    const { query } = router;
    const callbackUrl =
      query.callbackUrl instanceof Array
        ? query.callbackUrl[0]
        : query.callbackUrl;

    await signIn("credentials", {
      nim,
      password,
      csrfToken,
      callbackUrl,
    });
  };

  return (
    <Layout title="Sign In">
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <Controller
          name="nim"
          control={control}
          render={({ field }) => <input {...field} />}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => <input {...field} />}
        />
        {errors.nim && <p role="alert">{errors.nim.message}</p>}
        {errors.password && <p role="alert">{errors.password.message}</p>}
        <input type="submit" />
      </form>
    </Layout>
  );
}
