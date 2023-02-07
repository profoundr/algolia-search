import {Heading, Input} from '~/components';
import {Layout} from '~/components/index.server';

export function SearchPage({
  searchTerm,
  children,
}: {
  searchTerm?: string | null;
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <div className="max-w-full md:max-w-5xl mx-auto md:px-0 pt-[76px]">
        <div className="w-full md:w-2/3 gap-4 md:gap-8 grid pl-0 border-none">
          <div className="flex md:flex-row flex-col items-start justify-between">
            <Heading
              as="h2"
              size="copy"
              className="!font-benton text-4xl text-black uppercase tracking-[3px] md:pr-5 w-full md:text-left text-center"
            >
              <span className="font-bebas text-base block mb-1">
                Search results for::
              </span>
              {searchTerm}
            </Heading>
            <form className="relative flex text-heading md:order-1 -order-1 md:w-44 w-[94%] md:mb-0 mb-5 mx-auto">
              <input
                defaultValue={searchTerm ? searchTerm : ''}
                placeholder="Search…"
                type="search"
                // variant="search"
                name="q"
                className="!font-bebas !text-sm bg-[#f2f3f5] inline-block border-0 border-b-0 !py-[10px] !px-3 !h-9 !leading-9 uppercase box-border text-textPrimary-400 w-full"
              />
              <button
                className="absolute block bg-no-repeat overflow-hidden w-[14px] h-[13px] bg-transparent text-[0px] border-0 cursor-pointer right-[10px] top-[11px]"
                type="submit"
                style={{
                  backgroundImage:
                    'url(//cdn.shopify.com/s/files/1/0282/5148/8387/t/26/assets/sprite.png?v=1010068806382716213)',
                  backgroundPosition: '0 -63px',
                }}
              ></button>
            </form>
          </div>
        </div>
        {children}
      </div>
    </Layout>
  );
}
