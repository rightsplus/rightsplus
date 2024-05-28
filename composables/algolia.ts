import algoliasearch from 'algoliasearch';
export const useAlgoliaInitIndexFull = (index: string) => {
	const { applicationId } = useRuntimeConfig().public.algolia;
	const client = algoliasearch(applicationId, '68dbedee088b7c2d0d63b754271aa47c');
	return client.initIndex(index);
}