import { faker } from "@faker-js/faker";

export interface ISessionsCreateUserProps {
  rfc: string;
  name: string;
  apPaterno: string;
  apMaterno: string;
  phone: string;
  email: string;
  password: string;
  username?: string;
}

export const fakeUser = (): ISessionsCreateUserProps => ({
  email: faker.internet.email({
    firstName: "fv",
    lastName: "fsession",
  }) as string,
  name: faker.lorem.word({ length: 2 }) as string,
  apMaterno: faker.lorem.word({ length: 1 }) as string,
  apPaterno: faker.lorem.word({ length: 1 }) as string,
  password: faker.internet.password() as string,
  phone: faker.string.numeric({ length: 9 }) as string,
  rfc: `99${faker.string.numeric({ length: 4 })}33`,
  username: faker.internet.userName() as string,
});

const baseUrl = "https://apimex.firmavirtual.com/apiii";

export const LoginFlashUser = async (email: string, password: string) => {
  try {
    const result = await fetch(`${baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return result.json();
  } catch (error: any) {
    throw new Error(error);
  }
};

export const CreateFlashUser = async () => {
  const flashUser = fakeUser();

  if (flashUser) {
    try {
      const result = await fetch(`${baseUrl}/register`, {
        method: "POST",
        body: JSON.stringify({
          username: flashUser.email,
          rfc: flashUser.rfc,
          name: flashUser.name,
          apMaterno: flashUser.apMaterno,
          apPaterno: flashUser.apPaterno,
          password: flashUser.password,
          email: flashUser.email,
          phone: flashUser.phone,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const user = await result.json();

      if (user.status === "success") {
        const loggedIn = await LoginFlashUser(
          flashUser.email,
          flashUser.password,
        );

        if (loggedIn.status === "success") {
          localStorage.setItem("flashUserToken", loggedIn.data[0].token);
        }
      }

      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }
};
