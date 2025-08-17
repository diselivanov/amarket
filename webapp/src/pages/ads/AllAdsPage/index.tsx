import { zGetAdsTrpcInput } from '@amarket/backend/src/router/ads/getAds/input'
import InfiniteScroll from 'react-infinite-scroller'
import { Alert } from '../../../components/Alert'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import css from './index.module.scss'
import { AdCard } from '../../../components/AdCard'
import { AdsSection } from '../../../components/AdsSection'
import { Header } from '../../../components/Header'
import React from 'react'
import { SideSection } from '../../../components/SideSection'

export const AllAdsPage = withPageWrapper({
  title: 'AMarket',
  isTitleExact: true,
})(() => {
  const { formik } = useForm({
    initialValues: { search: '' },
    validationSchema: zGetAdsTrpcInput.pick({ search: true }),
  })

  const [searchQuery, setSearchQuery] = React.useState('')

  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getAds.useInfiniteQuery(
      {
        search: searchQuery,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor
        },
      }
    )

  const handleSearch = () => {
    setSearchQuery(formik.values.search || '')
  }

  return (
    <Segment title={undefined}>
      <Header
        maxWidth={'100%'}
        label="Что хотите найти ?"
        name="search"
        formik={formik}
        onSearch={handleSearch}
        isLoading={isLoading || isRefetching}
        showSearch
        showCategories
      />
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : !data.pages[0].ads.length ? (
        <Alert color="blue">Ничего не найдено</Alert>
      ) : (
        <InfiniteScroll
          threshold={250}
          loadMore={() => {
            if (!isFetchingNextPage && hasNextPage) {
              void fetchNextPage()
            }
          }}
          hasMore={hasNextPage}
          loader={
            <div className={css.more} key="loader">
              <Loader type="section" />
            </div>
          }
          getScrollParent={() => layoutContentElRef.current}
          useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
        >
          <div className={css.Sections}>
            <SideSection></SideSection>

            <AdsSection>
              {data.pages
                .flatMap((page) => page.ads)
                .map((ad) => (
                  <AdCard key={ad.id} id={ad.id} title={ad.title} price={ad.price} city={ad.city} images={ad.images} />
                ))}
            </AdsSection>

            <SideSection></SideSection>
          </div>
        </InfiniteScroll>
      )}
    </Segment>
  )
})