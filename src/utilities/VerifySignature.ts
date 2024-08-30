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

const baseUrl = "https://apimex.firmavirtual.com/apii";

export const VerifySignature = async () => {
  const token = localStorage.getItem("flashUserToken");
  const contractString = localStorage.getItem("contractData");
  const contractData = contractString ? JSON.parse(contractString) : null;

  if (token && contractData) {
    try {
      const result = await fetch(
        `${baseUrl}/contractid/${contractData.contractId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (result.ok) {
        const data = await result.json();
        return data;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
};
