import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'InProgress',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    apiStatus: apiConstants.initial,
    searchInput: '',
    activeCategoryId: '',
    activeRatingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, searchInput, activeCategoryId, activeRatingId} =
      this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const showProductsList = productsList.length > 0

    return showProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
          value={title_search}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="noproducts-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
          className="noproduct-image"
        />
        <h1 className="noproduct-heading">No Products Found</h1>
        <p className="desc">
          We could not find any products. Try other filters
        </p>
      </div>
    )
  }

  // TODO: Add No Products View

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  renderFailure = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="noproduct-heading">Oops! Something Went Wrong</h1>
      <p className="desc">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="Threedots" color="#ob69ff" height={50} width={50} />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderProductsList()
      case apiConstants.failure:
        return this.renderFailure()
      case apiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  onChangeInput = searchInput => {
    this.setState({
      searchInput,
    })
  }

  enterSearchInput = () => {
    this.getProducts()
  }
  changeCategoryId = activeCategoryId => {
    this.setState(
      {
        activeCategoryId,
      },
      this.getProducts,
    )
  }

  changeRatingId = activeRatingId => {
    this.setState(
      {
        activeRatingId,
      },
      this.getProducts,
    )
  }

  clearFilters = () => {
    this.setState(
      {
        searchInput: '',
        activeRatingId: '',
        activeCategoryId: '',
      },
      this.getProducts,
    )
  }
  render() {
    const {activeCategoryId, activeRatingId, searchInput} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingList={ratingsList}
          searchInput={searchInput}
          categoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          changeSearchInput={this.onChangeInput}
          enterSearchInput={this.enterSearchInput}
          changeRating={this.changeRatingId}
          changeCategory={this.changeCategoryId}
          clearFilters={this.clearFilters}
        />

        {this.renderAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
