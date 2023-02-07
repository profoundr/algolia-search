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
import defaultItems from '../../../defaultItems.json';

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

function LocationItem({hit, components}: any) {
  return (
    <a href={'/pages/' + hit.handle} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Highlight hit={hit.title} attribute="title" />
          </div>
        </div>
      </div>
    </a>
  );
}
function CollectionItem({hit, components}: any) {
  const img = hit.image;
  const icon = img.replace('.jpg', '_icon.jpg');
  return (
    <a
      href={'/collections/' + hit.handle}
      className="aa-ItemLink flex group group-hover:bg-gray-100"
    >
      <div className="aa-ItemContent">
        <div className="">
          <Image src={icon} alt={hit.title} width="40" height="40" />
        </div>
        <div className="aa-ItemContentBody ml-3">
          {/* <p className="hit-category">{hit.product_type}</p> */}
          <div className="aa-ItemContentTitle text-[#2F2F2F] font-normal font-unica uppercase text-xs">
            {hit.title}
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

function ProductItem({hit, components}: any) {
  var img = hit.image;
  var icon = img.replace('.jpg', '_icon.jpg');
  return (
    <a
      href={
        '/products/' +
        hit.handle +
        '?queryID=' +
        hit.__autocomplete_queryID +
        '&objectID=' +
        hit.objectID
      }
      className="aa-ItemLink flex group group-hover:bg-gray-100"
    >
      <div className="aa-ItemContent">
        <div className="">
          <Image src={icon} alt={hit.title} width="40" height="40" />
        </div>
        <div className="aa-ItemContentBody ml-3">
          {/* <p className="hit-category">{hit.product_type}</p> */}
          <div className="aa-ItemContentTitle text-[#2F2F2F] font-normal">
            {hit.title}
          </div>
          <div className="aa-ItemContentDescription overflow-hidden -mt-1">
            <p className="text-[#8A8C91] font-[13px] font-medium">
              <span className="hit-em">$</span>
              {hit.price}{' '}
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
      plugins: [
        // recentSearchesPlugin,
        querySuggestionsPlugin,
        // algoliaInsightsPlugin,
      ],
      onSubmit({state}) {
        if (state.collections[0].items[0] != undefined) {
          window.location.replace(
            '/products/' + state.collections[0].items[0].handle,
          );
        } else if (
          state.collections[0].items[0] == undefined &&
          state.collections[1].items[0] != undefined
        ) {
          window.location.replace(
            '/collections/' + state.collections[1].items[0].handle,
          );
        } else if (
          state.collections[1].items[0] == undefined &&
          state.collections[0].items[0] == undefined &&
          state.collections[3].items[0] != undefined
        ) {
          window.location.replace(
            '/pages/' + state.collections[3].items[0].handle,
          );
        } else if (
          state.collections[1].items[0] == undefined &&
          state.collections[0].items[0] == undefined &&
          state.collections[3].items[0] == undefined &&
          state.collections[2].items[0] != undefined
        ) {
          window.location.replace(
            '/blogs/journal/' + state.collections[2].items[0].handle,
          );
        } else {
          window.location.replace('/search?' + state.query);
        }
      },
      onStateChange(params) {
        // console.log(document.querySelector('[type="search"]'), '<<<');
        // if (params.prevState.isOpen === true && params.state.isOpen === false) {
        //   setTimeout(() => {
        //     panelRootRef.current?.render('');
        //     console.log(panelRootRef.current, '------');
        //   }, 300);
        // }
        // !params.state.isOpen && search.refresh();
      },
      getSources({query}) {
        if (!query) {
          return [
            {
              sourceId: 'articles',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: algoConfig.prefix + 'articles',
                      query,
                      params: {
                        hitsPerPage: 3,
                        facetFilters: [defaultItems.articles],
                      },
                    },
                  ],
                });
              },
              getItemUrl({item}) {
                return '/blogs/journal/' + item.handle;
              },
              templates: {
                header() {
                  return (
                    <Fragment>
                      {' '}
                      <span className="text-[19px] text-black font-benton italic font-semibold">
                        journal
                      </span>
                      <div className="bg-[#8A8C9133]/20 h-[1px] w-full mt-1" />
                    </Fragment>
                  );
                },
                item({item}) {
                  return (
                    <a
                      href={'/blogs/journal/' + item.handle}
                      className="aa-ItemLink"
                    >
                      <div className="aa-ItemContent">
                        <div className="aa-ItemContentBody text-[15px] text-[#2F2F2F] font-normal font-unica">
                          {item.title}
                        </div>
                      </div>
                    </a>
                  );
                },
              },
            },
            {
              sourceId: 'products',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: algoConfig.prefix + 'products',
                      query,
                      params: {
                        hitsPerPage: 3,
                        facetFilters: [defaultItems.products],
                        distinct: true,
                        clickAnalytics: true,
                      },
                    },
                  ],
                });
              },
              getItemUrl({item}) {
                return (
                  '/products/' +
                  item.handle +
                  '?queryID=' +
                  item.__autocomplete_queryID +
                  '&objectID=' +
                  item.objectID
                );
              },
              templates: {
                // header() {
                //   return (
                //     <Fragment>
                //       <span className="aa-SourceHeaderTitle">Products</span>
                //       <div className="aa-SourceHeaderLine" />
                //     </Fragment>
                //   );
                // },
                item({item, components}) {
                  return <ProductItem hit={item} components={components} />;

                  // return <DefaultItems />;
                },
                // noResults() {
                //   return 'No products found';
                // },
              },
            },
            {
              sourceId: 'collections',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: algoConfig.prefix + 'collections',
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
        }
        return [
          {
            sourceId: 'collections',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.prefix + 'collections',
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
          {
            sourceId: 'articles',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.prefix + 'articles',
                    query,
                    params: {
                      hitsPerPage: 3,
                    },
                  },
                ],
              });
            },
            getItemUrl({item}) {
              return '/blogs/journal/' + item.handle;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    {' '}
                    <span className="text-[19px] text-black font-benton italic font-semibold">
                      journal
                    </span>
                    <div className="bg-[#8A8C9133]/20 h-[1px] w-full mt-1" />
                  </Fragment>
                );
              },
              item({item}) {
                return (
                  <a
                    href={'/blogs/journal/' + item.handle}
                    className="aa-ItemLink"
                  >
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody text-[15px] text-[#2F2F2F] font-normal font-unica">
                        {item.title}
                      </div>
                    </div>
                  </a>
                );
              },
            },
          },
          {
            sourceId: 'pages',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.prefix + 'pages',
                    query,
                    params: {
                      hitsPerPage: 3,
                      facetFilters: 'template_suffix:location-v2',
                    },
                  },
                ],
              });
            },
            getItemUrl({item}) {
              return '/pages/' + item.handle;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    {' '}
                    <span className="text-[19px] text-black font-benton italic font-semibold">
                      locations
                    </span>
                    <div className="bg-[#8A8C9133]/20 h-[1px] w-full mt-1" />
                  </Fragment>
                );
              },
              item({item, component}) {
                return (
                  <a href={'/pages/' + item.handle} className="aa-ItemLink">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody text-[#2F2F2F] text-[15px] font-normal font-unica">
                        {item.title}
                      </div>
                    </div>
                  </a>
                );
              },
              // noResults() {
              //   return 'No pages found';
              // },
            },
          },
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.prefix + 'products',
                    query,
                    params: {
                      hitsPerPage: 3,
                      distinct: true,
                      clickAnalytics: true,
                    },
                  },
                ],
              });
            },
            getItemUrl({item}) {
              return (
                '/products/' +
                item.handle +
                '?queryID=' +
                item.__autocomplete_queryID +
                '&objectID=' +
                item.objectID
              );
            },
            templates: {
              // header() {
              //   return (
              //     <Fragment>
              //       <span className="aa-SourceHeaderTitle">Products</span>
              //       <div className="aa-SourceHeaderLine" />
              //     </Fragment>
              //   );
              // },
              item({item, components}) {
                return <ProductItem hit={item} components={components} />;
              },
              // noResults() {
              //   return 'No products found';
              // },
            },
          },
          // {
          //   sourceId: 'editorial',
          //   getItems() {
          //     return [
          //       {
          //         title: 'Search in all products',
          //         url: '/search?q=' + query,
          //       },
          //     ];
          //   },
          //   getItemUrl({item}) {
          //     return item.url;
          //   },
          //   templates: {
          //     item({item}: any) {
          //       return (
          //         <a href={item.url} className="aa-ItemLink">
          //           <div className="aa-ItemContent">
          //             <div className="aa-ItemContentBody">
          //               <div className="m-3 text-sm font-semibold text-blue-800">
          //                 {item.title}
          //               </div>
          //             </div>
          //           </div>
          //         </a>
          //       );
          //     },
          //   },
          // },
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
                {/* {recentSearchesPlugin} */}
                {/* {querySuggestionsPlugin} */}
                {products}
                {collections}
                {pages}
                {articles}
              </div>
              {/* <div className="flex-auto">
                {editorial}
              </div> */}
            </div>
          </div>,
        );
      },
    });
    const searchInput = document.querySelector('.aa-Input[type="search"]');
    // const clearButon = document.querySelector('.aa-ClearButton[type="reset"]');
    searchInput?.addEventListener('blur', () => {
      // console.log('blurobject', search);
      search.setIsOpen(false);
      panelRootRef?.current?.render('');
    });
    return () => {
      // console.log('return');
      search.destroy();
    };
  }, [dropdownRef]);
  return <div ref={containerRef} />;
}
