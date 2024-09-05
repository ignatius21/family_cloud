import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "El registro fallo, intenta nuevamente.", });
        
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Algo salio mal, por favor inicia sesion nuevamente.", });
        
        navigate("/sign-in");
        
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({ title: "El registro fallo, intenta nuevamente.", });
        
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        {/* <img src="/assets/images/logo.svg" alt="logo" /> */}

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-gray-600">
          Crea tu cuenta
        </h2>
        <p className="text-gray-500 small-medium md:base-regular mt-2">
          Para usar CloudFamily necesitas una cuenta.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-gray-500">Nombre</FormLabel>
                <FormControl>
                  <div className="relative">
                    <img
                      src="/assets/icons/user.svg"
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-gray-500">Usuario</FormLabel>
                <FormControl>
                  <div className="relative">
                    <img
                      src="/assets/icons/user2.svg"
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
              {isCreatingAccount || isSigningInUser || isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Cargando...
                </div>
              ) : (
                "Registrarse"
              )}
            </Button>
          </div>

          <p className="text-small-regular text-gray-400 text-center mt-2">
            Ya tienes una cuenta?
            <Link
              to="/sign-in"
              className="text-gray-600 font-medium ml-1">
              Ingresa
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
