// Delete This
import '@algolia/autocomplete-theme-classic';
import {getAlgoliaResults} from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import {useEffect, useRef, createElement, Fragment} from 'react';
import {createRoot} from 'react-dom/client';
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions';
// import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches';
import {autocomplete} from '@algolia/autocomplete-js';
import {Image} from '@shopify/hydrogen';
import algoConfig from '../../../algolia.config.json';
import './aastyles.css';

const appId = algoConfig.appId;
const apiKey = algoConfig.appKey;
const searchClient = algoliasearch(appId, apiKey);

// Create recent search plugin
// const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
//   key: 'hydrogen-algolia-demo',
//   limit: 3,
// });

// Create query suggestion plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: algoConfig.QSindex, // Get index name from Algolia config
  getSearchParams() {
    return {hitsPerPage: 3};
  },
  transformSource({source}) {
    return {
      ...source,
      getItemUrl({item}) {
        return '/search?q=' + item.query;
      },
      templates: {
        ...source.templates,
        header() {
          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">Sugguestions</span>
              <div className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
        item(params) {
          const {item, html} = params;
          return html`<a className="aa-ItemLink" href="/search?q=${item.query}">
            ${source.templates.item(params).props.children}
          </a>`;
        },
      },
    };
  },
});

function CollectionItem({hit, components}: any) {
  // const img = hit.image;
  // const icon = img.replace('.jpg', '_icon.jpg');
  return (
    <a
      href={'/collections/' + hit.handle}
      className="aa-ItemLink flex group group-hover:bg-gray-100"
    >
      <div className="aa-ItemContent">
        <div className="">
          <Image src={hit.image} alt={hit.title} width="40" height="40" />
        </div>
        <div className="aa-ItemContentBody ml-3">
          {/* <p className="hit-category">{hit.product_type}</p> */}
          <div className="aa-ItemContentTitle text-[#2F2F2F] font-normal font-unica uppercase text-xs account-name">
            {hit.name}
          </div>
          <div className="aa-ItemContentDescription overflow-hidden -mt-1">
            <p className="text-[#8A8C91] font-unica text-[10px] font-normal leading-3">
              {hit.body_html_safe}{' '}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

declare global {
  interface Window {
    aa: any;
  }
}

export default function AlgoliaAutocomplete({dropdownRef}: any) {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    // const insightsClient = window.aa;
    // Init insights client
    // insightsClient('init', {
    //   appId: algoConfig.appId,
    //   apiKey: algoConfig.appKey,
    //   useCookie: true,
    // });
    // const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({insightsClient});

    let detached = false; //check if is detached view
    const search = autocomplete({
      container: containerRef.current,
      placeholder: 'Search for organizing services, products & more',
      openOnFocus: true,
      plugins: [querySuggestionsPlugin],
      onSubmit({state}) {},
      onStateChange(params) {},
      getSources({query}) {
        if (!query) {
          return [
            {
              sourceId: 'collections',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: algoConfig.prefix,
                      query,
                      params: {
                        hitsPerPage: 2,
                      },
                    },
                  ],
                });
              },
              getItemUrl({item}) {
                return '/collections/' + item.handle;
              },
              templates: {
                header() {
                  return (
                    <Fragment>
                      <span className="text-[19px] text-black font-benton italic font-semibold">
                        collections
                      </span>
                      <div className="bg-[#8A8C9133]/20 h-[1px] w-full mt-1" />
                    </Fragment>
                  );
                },
                item({item}) {
                  return <CollectionItem hit={item} />;
                },
              },
            },
          ];
        }
        return [
          {
            sourceId: 'collections',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.prefix,
                    query,
                    params: {
                      hitsPerPage: 2,
                    },
                  },
                ],
              });
            },
            getItemUrl({item}) {
              return '/collections/' + item.handle;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="text-[19px] text-black font-benton italic font-semibold">
                      collections
                    </span>
                    <div className="bg-[#8A8C9133]/20 h-[1px] w-full mt-1" />
                  </Fragment>
                );
              },
              item({item}) {
                return <CollectionItem hit={item} />;
              },
              // noResults() {
              //   return 'No collections found';
              // },
            },
          },
        ];
      },
      renderer: {createElement, Fragment, render: () => {}},
      render({elements}, root) {
        if (!panelRootRef.current) {
          panelRootRef.current = detached
            ? createRoot(root)
            : createRoot(dropdownRef.current);
        }
        let detachedState = Boolean(
          root.parentElement &&
            root.parentElement.className == 'aa-DetachedContainer',
        );
        if (detachedState != detached) {
          panelRootRef.current?.unmount();
          panelRootRef.current = detachedState
            ? createRoot(root)
            : createRoot(dropdownRef.current);
          detached = detachedState;
        }

        const {
          recentSearchesPlugin,
          querySuggestionsPlugin,
          products,
          editorial,
          collections,
          articles,
          pages,
        } = elements;

        // Use this function to render what you need along with `children`
        // Each state update will re-render
        // Render a horizontal federated search panel
        panelRootRef.current.render(
          <div className="aa-PanelLayout aa-Panel--scrollable 1">
            <div className="flex">
              <div className="flex-auto mr-3 ml-3">
                {products}
                {collections}
                {pages}
                {articles}
              </div>
            </div>
          </div>,
        );
      },
    });
    const searchInput = document.querySelector('.aa-Input[type="search"]');
    searchInput?.addEventListener('blur', () => {
      search.setIsOpen(false);
      panelRootRef?.current?.render('');
    });
    return () => {
      search.destroy();
    };
  }, [dropdownRef]);
  return <div ref={containerRef} />;
}
