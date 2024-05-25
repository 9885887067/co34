import './index.css'

const FiltersGroup = props => {
  const renderRatingFilters = () => {
    const {ratingList} = props
    return ratingList.map(rating => {
      const {changeRating, activeRatingId} = props
      const onClickRatingItem = () => changeRating(rating.ratingId)
      const ratingClassName =
        activeRatingId === rating.rating.id ? 'and-up active' : 'and-up'
      return (
        <li
          className="rating-item"
          key={rating.ratingId}
          onClick={onClickRatingItem}
        >
          <img
            src={rating.imgUrl}
            alt={`rating ${rating.ratingId}`}
            className="rating-img"
          />
          <p className={ratingClassName}>& up</p>
        </li>
      )
    })
  }

  const renderRatingList = () => (
    <div>
      <h1 className="heading">Rating</h1>
      <ul className="ratings-list">{renderRatingFilters()}</ul>
    </div>
  )

  const renderCategoryList = () => {
    const {categoryOptions} = props

    return categoryOptions.map(category => {
      const {activeCategoryId, changeCategory} = props

      const onClickCategoryItem = () => changeCategory(category.categoryId)

      const categoryClassName =
        category.categoryId === activeCategoryId
          ? 'category-name active-category-name'
          : 'category-name'

      return (
        <li className="category-item">
          key={category.categoryId}
          onClick={onClickCategoryItem}
          <p className={categoryClassName}>{category.name}</p>
        </li>
      )
    })
  }

  const renderProductCategory = () => (
    <>
      <h1 className="heading">Category</h1>
      <ul className="category-list">{renderCategoryList()}</ul>
    </>
  )

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onChangeInput = event => {
    const {changeSearchInput} = props

    changeSearchInput(event.target.value)
  }

  const renderSearchInput = () => {
    const {searchInput} = props
    return (
      <div>
        <input
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={onChangeInput}
          onKeyDown={onEnterSearchInput}
        />
      </div>
    )
  }

  const {clearFilters} = props

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
      {renderProductCategory()}
      {renderRatingList()}
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  )
}

export default FiltersGroup
