declare module 'is-european' {
  // Define the type of the module export here
  export function euMember(countryCode: string): boolean;
  export function eeaMember(countryCode: string): boolean;
  export function getCountry(countryCode: string): boolean;

}