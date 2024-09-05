import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Query
  const { mutateAsync: signInAccount, isLoading } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(user);

    if (!session) {
      toast({ title: "El inicio fallo, intenta nuevamente." });

      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      toast({ title: "El inicio fallo, intenta nuevamente." });

      return;
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        {/* <img src="/assets/images/logoFC.png" alt="logo" width={120} height={22}/> */}

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-gray-600">
          <p className="text-gray-500 small-medium md:base-regular mt-2 text-center">
            Bienvenido 🖐
          </p>
          Ingresa a tu cuenta
        </h2>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-gray-500">Correo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <img
                      src="/assets/icons/email.svg"
                      alt="email"
                      width={22}
                      height={22}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    />
                    <Input type="text" className="rounded-2xl pl-9 shadow-md text-gray-600 border-none" {...field} />
                  </div>
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
                <FormLabel className="text-gray-500">Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <img
                      src="/assets/icons/password.svg"
                      alt="email"
                      width={22}
                      height={22}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    />
                    <Input
                      type="password"
                      className="rounded-2xl pl-9 shadow-md border-none text-gray-600"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit" className="rounded-xl shadow-md mt-10 w-1/2">
              {isLoading || isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Cargando...
                </div>
              ) : (
                "Ingresar"
              )}
            </Button>
          </div>

          <p className="text-small-regular text-gray-400 text-center mt-2">
            No tienes una cuenta?
            <Link
              to="/sign-up"
              className="text-gray-600 font-medium ml-1">
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
