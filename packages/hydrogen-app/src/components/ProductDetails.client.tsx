import {Product} from '@shopify/hydrogen/client';
import React from 'react';
import PortableText from './PortableText.client';
import SanityGallery from './SanityGallery.client';
import SanityProductOptions from './SanityProductOptions.client';

type Props = {
  page: any,
};

export default function ProductDetails({page}: Props) {
  // TODO: this is a huge hack
  const product = JSON.parse(page?.provider);
  const options = page?.shopify?.options;

  return (
    <div className="p-4">
      {/* <Seo product={product} /> */}
      <Product
        product={product}
        initialVariantId={product.variants.edges[0].node.id}
      >
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2 grid gap-10" aria-label="Gallery">
            {page?.images && <SanityGallery images={page.images} />}
          </section>

          <section
            className="my-4 md:my-0 max-w-md flex flex-col gap-6"
            aria-label="Product details"
          >
            {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
            <div>
              <Product.Title className="text-gray-900 font-medium" />
              <div className="gap-1">
                <Product.SelectedVariant.Price className="font-medium text-gray-900">
                  {({currencyCode, amount, currencyNarrowSymbol}) => {
                    return (
                      <span>{`${currencyCode} ${currencyNarrowSymbol}${amount}`}</span>
                    );
                  }}
                </Product.SelectedVariant.Price>
                <Product.SelectedVariant.Price
                  priceType="compareAt"
                  className="text-gray-400 line-through text-xl"
                >
                  {({amount, currencyNarrowSymbol}) => {
                    return <span>{`${currencyNarrowSymbol}${amount}`}</span>;
                  }}
                </Product.SelectedVariant.Price>
                <Product.SelectedVariant.UnitPrice className="text-gray-900 text-base">
                  {({
                    currencyCode,
                    amount,
                    currencyNarrowSymbol,
                    referenceUnit,
                  }) => {
                    return (
                      <span>{`${currencyCode} ${currencyNarrowSymbol}${amount}/${referenceUnit}`}</span>
                    );
                  }}
                </Product.SelectedVariant.UnitPrice>
              </div>

              {/* (Sanity powered) Product options */}
              {options && (
                <div className="mt-5">
                  <SanityProductOptions options={options} />
                </div>
              )}

              {/* Actions */}
              <div className="my-8 space-y-2">
                <Product.SelectedVariant.AddToCartButton className="bg-gray-900 text-white text-center p-4 text-sm w-full">
                  Add to cart
                </Product.SelectedVariant.AddToCartButton>
                <Product.SelectedVariant.BuyNowButton className="bg-white border border-black text-center p-4 text-sm w-full">
                  Buy it now
                </Product.SelectedVariant.BuyNowButton>

                {/* Shop pay */}
                {/* <Product.SelectedVariant.ShopPayButton className="flex justify-center w-full" /> */}
              </div>

              {/* Custom sections */}
              <div className="my-4">
                {page?.sections?.map((section, index) => (
                  <div className="mb-8" key={index}>
                    <div className="font-medium text-sm">{section?.title}</div>
                    <div className="text-gray-500 text-sm">
                      {section?.body && <PortableText blocks={section.body} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Divider */}
        {page?.body && <div className="bg-gray-300 h-px my-10 w-full" />}

        {/* Body */}
        {page?.body && (
          <div className="max-w-2xl mt-10">
            <PortableText blocks={page.body} />
          </div>
        )}
      </Product>
    </div>
  );
}
