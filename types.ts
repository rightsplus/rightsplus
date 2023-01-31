import publicRuntimeConfig from '@nuxtjs/strapi/dist/module'
import { Ref } from 'vue'
import { useStrapi4 } from '@nuxtjs/strapi/dist/runtime/composables/useStrapi4'
import { useStrapiAuth } from '@nuxtjs/strapi/dist/runtime/composables/useStrapiAuth'
import { StrapiAuthenticationData, StrapiAuthenticationResponse, StrapiAuthProvider, StrapiEmailConfirmationData, StrapiForgotPasswordData, StrapiRegistrationData, StrapiResetPasswordData, Strapi4RequestParams } from '@nuxtjs/strapi/dist/runtime/types'
export { Strapi4Response, Strapi4ResponseData, Strapi4RequestParams } from '@nuxtjs/strapi/dist/runtime/types'
export { EventAttributes } from 'ics/index'

export interface Event {
  attributes: {
    title: string;
    description: string;
    price: number;
    groupSize: number;
    start: string;
    end: string;
    time: string;
    offer: {
      data: Offer
    }
  }
}
export interface Offer {
  id: number;
  attributes: {
    title: string;
    slug: string;
    createdAt: string
    updatedAt: string
    events: {
      data: EventAttributes[]
    }
    hero: {
      copy: string;
      image: {
        data: {
          id: number;
          attributes: Media;
        }
      }
      data: {
        id: number
        attributes: Media
      }
    }
  }
}
export interface EventAttributes {

}

export interface ImageProps {
	name: string,
	hash: string,
	ext: string,
	mime: string,
	path: string | null,
	width: number,
	height: number,
	size: number,
	url: string
}
export interface Media extends ImageProps {
	alternativeText: string,
	caption: string,
	previewUrl: string | null,
	provider: string,
	provider_metadata: string | null,
	createdAt: string,
	updatedAt: string
	formats: {
		[key: string]: ImageProps
	}
}

export interface StrapiUser {
  blocked: boolean;
  confirmed: boolean;
  createdAt: string
  email: string
  id: number
  name: string
  provider: string
  updatedAt: string
  username: string
  role: string
}

interface Strapi {
  find(collection:string, params?: Strapi4RequestParams) : Promise<any>;
  findOne(contentType: string, id: string | number, params?: Strapi4RequestParams) : Promise<any>;
  create(collection:string, data:object) : Promise<any>;
  count(collection:string, params?:object) : Promise<any>;
  update(collection:string, id:number, data:object) : Promise<any>;
  delete(collection:string, id:number) : Promise<any>;
  setToken: (value: string | null) => void;
  setUser: (value: StrapiUser) => void;
  fetchUser: () => Promise<Ref<StrapiUser>>;
  login: (data: StrapiAuthenticationData) => Promise<StrapiAuthenticationResponse>;
  logout: () => void;
  register: (data: StrapiRegistrationData) => Promise<StrapiAuthenticationResponse>;
  forgotPassword: (data: StrapiForgotPasswordData) => Promise<void>;
  resetPassword: (data: StrapiResetPasswordData) => Promise<StrapiAuthenticationResponse>;
  sendEmailConfirmation: (data: StrapiEmailConfirmationData) => Promise<void>;
  getProviderAuthenticationUrl: (provider: StrapiAuthProvider) => string;
  authenticateProvider: (provider: StrapiAuthProvider, access_token: string) => Promise<StrapiAuthenticationResponse>;
  user: StrapiUser;
  api: typeof publicRuntimeConfig;
  client: <T>(contentType: string, data: Partial<T>, method?: string) =>  Promise<T>
}



declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $state: {
      headerColor: string
    },
    $strapi: Strapi
  }
}
