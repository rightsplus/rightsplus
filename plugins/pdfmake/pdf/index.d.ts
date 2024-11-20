import * as state from '@/store/state'

export interface PartnerDetails {
  logo?: string
  logoFooter?: string,
  address?: {
    company?: string,
    name: string,
    streetAddress: string,
    zip: string,
    city: string,
    country?: string,
  }
  contact?: {
    phone?: string,
    email?: string,
    url?: string,
  },
  taxInformation?: {
    tradeRegisterDepartment?: string,
    taxNumber?: string,
    vatNumber?: string,
  },
  bankInformation?: {
    bankName?: string,
    iban?: string,
    bic?: string,
  }

}
export interface QuoteSettings {
  title: string,
  totalDiscount?: boolean,
  singleDiscount?: boolean,
  openConfiguration?: boolean,
  hiddenSurcharge?: boolean,
  mergeShipping?: boolean,
  customPositions?: boolean,
  vatType?: 'default' | '1a' | '1b' | 'vatFree' | 'custom',
  vat?: number,
  currency?: string,
  paymentConditions?: string,
  shippingPrice?: number,
  letter?: {
    main?: boolean,
    installationRecommendation?: boolean,
    support?: boolean,
    terms?: boolean,
    message?: boolean,
    clerk?: boolean,
  },
  details?: {
    from?: PartnerDetails,
    to?: PartnerDetails,
  }
}
export interface GetAddressProps {
  state?: Partial<typeof state>,
  recipient?: 'partner' | 'customer',
  to?: PartnerDetails,
  from?: PartnerDetails,
  omit?: string[]
  only?: 'name' | 'address'
}