import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import './App.css'

const API_URL = 'http://localhost:5050'
const campusImage = '/abacCampus.jpeg'

type Role = 'student' | 'staff' | 'admin' | null

type ItemStatus =
  | 'OPEN'
  | 'MATCHED'
  | 'CLAIM_IN_PROGRESS'
  | 'RESOLVED'
  | 'DONATED'
  | 'DISPOSED'
  | 'ARCHIVED'

type Item = {
  id: number
  name: string
  category: string
  location: string
  date: string
  description: string
  image?: string
  status: ItemStatus
}

type LoginPageConfig = {
  role: 'student' | 'staff' | 'admin'
  title: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  showSignup?: boolean
}

/* =================================
   SAMPLE ITEMS
================================= */

const initialItems: Item[] = [
  {
    id: 1,
    name: 'Black Wallet',
    category: 'Wallet',
    location: 'AU Library',
    date: 'August 18, 2026',
    description:
      'A black leather wallet found near the library study area.',
    status: 'OPEN',
  },
  {
    id: 2,
    name: 'AirPods Case',
    category: 'Electronics',
    location: 'Cafeteria',
    date: 'August 17, 2026',
    description:
      'A white AirPods charging case found on a cafeteria table.',
    status: 'MATCHED',
  },
  {
    id: 3,
    name: 'Student ID Card',
    category: 'ID Card',
    location: 'ABAC Building',
    date: 'August 16, 2026',
    description:
      'A student identification card found near the entrance of the building.',
    status: 'CLAIM_IN_PROGRESS',
  },
]

/* =================================
   LOGIN CONFIGURATION
================================= */

const loginPages: Record<string, LoginPageConfig> = {
  '/student-login': {
    role: 'student',
    title: 'Student Login',
    description:
      'Use your AU student email and password to continue.',
    emailLabel: 'AU Student Email',
    emailPlaceholder: 'uID@au.edu',
    showSignup: true,
  },

  '/staff-login': {
    role: 'staff',
    title: 'Staff Login',
    description:
      'Use your staff account to continue.',
    emailLabel: 'Staff Email',
    emailPlaceholder: 'staffID@au.edu',
  },

  '/admin-login': {
    role: 'admin',
    title: 'Admin Login',
    description:
      'Use your administrator account to continue.',
    emailLabel: 'Admin Email',
    emailPlaceholder: 'adminID@au.edu',
  },
}

/* =================================
   NAVIGATION
================================= */

function navigate(path: string) {
  window.history.pushState({}, '', path)

  window.dispatchEvent(
    new PopStateEvent('popstate'),
  )

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

/* =================================
   STATUS DISPLAY NAMES
================================= */

function formatStatus(
  status: ItemStatus,
) {
  const statusNames: Record<
    ItemStatus,
    string
  > = {
    OPEN: 'Available',
    MATCHED: 'Potential Match',
    CLAIM_IN_PROGRESS: 'Under Review',
    RESOLVED: 'Returned',
    DONATED: 'Donated',
    DISPOSED: 'Disposed',
    ARCHIVED: 'Archived',
  }

  return statusNames[status]
}

/* =================================
   PUBLIC HOME
================================= */

function HomePage({
  items,
}: {
  items: Item[]
}) {
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return items
    }

    return items.filter((item) =>
      [
        item.name,
        item.category,
        item.location,
        item.description,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [items, search])

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
  }

  return (
    <main
      className="page-shell home-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="home-card">

        <header className="home-header">

          <div className="home-title-area">

            <p className="eyebrow">
              CAMPUS LOST &amp; FOUND
            </p>

            <h1>
              Find what you lost.
            </h1>

            <p className="home-description">
              Browse recently reported items around
              campus. You can view item details without
              logging in.
            </p>

          </div>

          <div className="home-auth-links">

            <button
              type="button"
              className="header-link"
              onClick={() =>
                navigate('/student-login')
              }
            >
              Student Login
            </button>

            <button
              type="button"
              className="header-link"
              onClick={() =>
                navigate('/staff-login')
              }
            >
              Staff Login
            </button>

          </div>

        </header>

        <form
          className="search-form"
          onSubmit={handleSearch}
        >

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by item, category, or location..."
          />

          <button
            type="submit"
            className="search-button"
          >
            Search
          </button>

        </form>

        <section className="items-section">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                RECENTLY REPORTED
              </p>

              <h2>
                Lost Items
              </h2>

            </div>

            <button
              type="button"
              className="sort-button"
            >
              Latest 7 days
            </button>

          </div>

          {filteredItems.length > 0 ? (

            <div className="items-grid">

              {filteredItems.map((item) => (

                <article
                  key={item.id}
                  className="item-card"
                >

                  <div className="item-card-image">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : null}

                    <span>
                      {item.category}
                    </span>

                  </div>

                  <div className="item-card-content">

                    <p className="item-category">
                      {item.category}
                    </p>

                    <h3>
                      {item.name}
                    </h3>

                    <div className="item-info">

                      <span>
                        📍 {item.location}
                      </span>

                      <span>
                        {item.date}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="view-item-button"
                      onClick={() =>
                        navigate(
                          `/item/${item.id}`,
                        )
                      }
                    >
                      View Details
                    </button>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="empty-items">

              <h3>
                No items found
              </h3>

              <p>
                Try searching for another item,
                category, or location.
              </p>

            </div>

          )}

        </section>

      </section>
    </main>
  )
}

/* =================================
   PUBLIC ITEM DETAIL
================================= */

function ItemDetailPage({
  item,
}: {
  item: Item
}) {
  const [showLoginMessage, setShowLoginMessage] =
    useState(false)

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="detail-card">

        <button
          type="button"
          className="detail-back-button"
          onClick={() =>
            navigate('/')
          }
        >
          ← Back to Lost &amp; Found
        </button>

        <div className="detail-layout">

          <div className="detail-image">

            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
              />
            ) : null}

            <span>
              {item.category}
            </span>

          </div>

          <div className="detail-content">

            <p className="eyebrow">
              FOUND ITEM
            </p>

            <h1>
              {item.name}
            </h1>

            <div className="detail-info-list">

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {item.category}
                </strong>
              </div>

              <div>
                <span>
                  Location
                </span>

                <strong>
                  {item.location}
                </strong>
              </div>

              <div>
                <span>
                  Reported
                </span>

                <strong>
                  {item.date}
                </strong>
              </div>

            </div>

            <div className="detail-description">

              <h3>
                Description
              </h3>

              <p>
                {item.description}
              </p>

            </div>

            <button
              type="button"
              className="claim-button"
              onClick={() =>
                setShowLoginMessage(true)
              }
            >
              Claim This Item
            </button>

            {showLoginMessage && (

              <div className="claim-login-message">

                <strong>
                  Login required
                </strong>

                <p>
                  Please log in as a student to
                  submit an ownership claim.
                </p>

                <button
                  type="button"
                  className="claim-login-button"
                  onClick={() =>
                    navigate(
                      '/student-login',
                    )
                  }
                >
                  Student Login
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  )
}

/* =================================
   LOGIN PAGE
================================= */

function LoginPage({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  showSignup = false,
  onLogin,
}: LoginPageConfig & {
  onLogin: () => void
}) {

  const [message, setMessage] =
    useState('')

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setMessage('Signing in...')

    setTimeout(() => {
      onLogin()
    }, 300)
  }

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="login-card">

        <button
          type="button"
          className="detail-back-button"
          onClick={() =>
            navigate('/')
          }
        >
          ← Back to Lost &amp; Found
        </button>

        <div className="card-heading">

          <p className="eyebrow">
            CAMPUS LOST &amp; FOUND
          </p>

          <h1>
            {title}
          </h1>

          <p>
            {description}
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <label className="field">

            <span>
              {emailLabel}
            </span>

            <input
              type="email"
              placeholder={emailPlaceholder}
              required
            />

          </label>

          <label className="field">

            <span>
              Password
            </span>

            <input
              type="password"
              placeholder="Enter your password"
              required
            />

          </label>

          <div className="form-row">

            <label className="checkbox">

              <input
                type="checkbox"
              />

              <span>
                Keep me signed in
              </span>

            </label>

            <button
              type="button"
              className="text-link text-button"
              onClick={() =>
                navigate(
                  '/forgot-password',
                )
              }
            >
              Forgot password?
            </button>

          </div>

          <button
            type="submit"
            className="submit-button"
          >
            Log in
          </button>

          {message && (
            <p className="form-status">
              {message}
            </p>
          )}

        </form>

        {showSignup && (

          <p className="signup-section">

            Don&apos;t have an account?{' '}

            <button
              type="button"
              className="text-link text-button"
              onClick={() =>
                navigate(
                  '/student-signup',
                )
              }
            >
              Sign up
            </button>

          </p>

        )}

      </section>

    </main>
  )
}

/* =================================
   STAFF DASHBOARD
================================= */

function StaffDashboard({
  items,
  onLogout,
}: {
  items: Item[]
  onLogout: () => void
}) {

  const recentItems =
    items.slice(0, 3)

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="dashboard-card">

        <div className="dashboard-header">

          <div>

            <p className="eyebrow">
              STAFF PORTAL
            </p>

            <h1>
              Staff Dashboard
            </h1>

            <p>
              Manage found items and help return
              them to their owners.
            </p>

          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={onLogout}
          >
            Log out
          </button>

        </div>

        <div className="dashboard-grid">

          <button
            type="button"
            className="dashboard-action-card"
            onClick={() =>
              navigate(
                '/staff/report-item',
              )
            }
          >

            <span className="dashboard-icon">
              +
            </span>

            <strong>
              Report Found Item
            </strong>

            <p>
              Add a newly found item to the
              Lost &amp; Found system.
            </p>

          </button>

          <button
            type="button"
            className="dashboard-action-card"
            onClick={() =>
              navigate('/staff/items')
            }
          >

            <span className="dashboard-icon">
              ◷
            </span>

            <strong>
              Manage Items
            </strong>

            <p>
              Review and manage reported
              found items.
            </p>

          </button>

          <button
            type="button"
            className="dashboard-action-card"
          >

            <span className="dashboard-icon">
              ✓
            </span>

            <strong>
              Claims
            </strong>

            <p>
              Review student ownership
              claims.
            </p>

          </button>

        </div>

        <div className="staff-recent-section">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                STAFF ACTIVITY
              </p>

              <h2>
                Recently Reported Items
              </h2>

            </div>

          </div>

          {recentItems.length > 0 ? (

            <div className="staff-recent-list">

              {recentItems.map((item) => (

                <div
                  key={item.id}
                  className="staff-recent-item"
                >

                  <div className="staff-recent-image">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    ) : (

                      <span>
                        {item.category}
                      </span>

                    )}

                  </div>

                  <div className="staff-recent-info">

                    <span className="item-category">
                      {item.category}
                    </span>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      📍 {item.location}
                    </p>

                  </div>

                  <button
                    type="button"
                    className="staff-view-button"
                    onClick={() =>
                      navigate(
                        `/staff/items/${item.id}`,
                      )
                    }
                  >
                    Manage
                  </button>

                </div>

              ))}

            </div>

          ) : (

            <div className="staff-empty-state">

              <p>
                No items have been reported yet.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  )
}

/* =================================
   STAFF MANAGE ITEMS
================================= */

function StaffManageItemsPage({
  items,
}: {
  items: Item[]
}) {

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState<'ALL' | ItemStatus>('ALL')

  const filteredItems = useMemo(() => {

    const query =
      search.trim().toLowerCase()

    return items.filter((item) => {

      const matchesSearch =
        !query ||
        [
          item.name,
          item.category,
          item.location,
          item.description,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.status === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })

  }, [items, search, statusFilter])

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="dashboard-card">

        <button
          type="button"
          className="detail-back-button"
          onClick={() =>
            navigate('/staff-dashboard')
          }
        >
          ← Back to Staff Dashboard
        </button>

        <div className="dashboard-header">

          <div>

            <p className="eyebrow">
              STAFF PORTAL
            </p>

            <h1>
              Manage Items
            </h1>

            <p>
              Review and manage all found items
              reported by staff.
            </p>

          </div>

        </div>

        <div className="staff-item-toolbar">

          <div className="staff-item-search">

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search items..."
            />

          </div>

          <select
            className="staff-status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | 'ALL'
                  | ItemStatus,
              )
            }
          >

            <option value="ALL">
              All Statuses
            </option>

            <option value="OPEN">
              Available
            </option>

            <option value="MATCHED">
              Potential Match
            </option>

            <option value="CLAIM_IN_PROGRESS">
              Under Review
            </option>

            <option value="RESOLVED">
              Returned
            </option>

            <option value="DONATED">
              Donated
            </option>

            <option value="DISPOSED">
              Disposed
            </option>

            <option value="ARCHIVED">
              Archived
            </option>

          </select>

        </div>

        <div className="staff-item-count">

          {filteredItems.length}{' '}
          {filteredItems.length === 1
            ? 'item'
            : 'items'}{' '}
          found

        </div>

        {filteredItems.length > 0 ? (

          <div className="staff-items-list">

            {filteredItems.map((item) => (

              <article
                key={item.id}
                className="staff-item-row"
              >

                <div className="staff-item-thumbnail">

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  ) : (

                    <span>
                      {item.category}
                    </span>

                  )}

                </div>

                <div className="staff-item-main">

                  <span className="item-category">
                    {item.category}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    📍 {item.location}
                  </p>

                  <small>
                    Reported {item.date}
                  </small>

                </div>

                <div className="staff-item-status">

                  <span
                    className={`status-badge status-${item.status.toLowerCase()}`}
                  >
                    {formatStatus(
                      item.status,
                    )}
                  </span>

                </div>

                <button
                  type="button"
                  className="staff-manage-button"
                  onClick={() =>
                    navigate(
                      `/staff/items/${item.id}`,
                    )
                  }
                >
                  Manage
                </button>

              </article>

            ))}

          </div>

        ) : (

          <div className="staff-empty-state">

            <h3>
              No items found
            </h3>

            <p>
              Try changing your search or
              status filter.
            </p>

          </div>

        )}

      </section>

    </main>
  )
}

/* =================================
   STAFF ITEM DETAIL
================================= */

function StaffItemDetailPage({
  item,
  onUpdateItem,
}: {
  item: Item
  onUpdateItem: (
    item: Item,
  ) => void
}) {

  const [status, setStatus] =
    useState<ItemStatus>(
      item.status,
    )

  const [message, setMessage] =
    useState('')

  function saveChanges() {

    onUpdateItem({
      ...item,
      status,
    })

    setMessage(
      'Item updated successfully.',
    )
  }

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="detail-card">

        <button
          type="button"
          className="detail-back-button"
          onClick={() =>
            navigate('/staff/items')
          }
        >
          ← Back to Manage Items
        </button>

        <div className="detail-layout">

          <div className="detail-image">

            {item.image ? (

              <img
                src={item.image}
                alt={item.name}
              />

            ) : null}

            <span>
              {item.category}
            </span>

          </div>

          <div className="detail-content">

            <p className="eyebrow">
              STAFF ITEM MANAGEMENT
            </p>

            <h1>
              {item.name}
            </h1>

            <div className="detail-info-list">

              <div>

                <span>
                  Category
                </span>

                <strong>
                  {item.category}
                </strong>

              </div>

              <div>

                <span>
                  Location
                </span>

                <strong>
                  {item.location}
                </strong>

              </div>

              <div>

                <span>
                  Reported
                </span>

                <strong>
                  {item.date}
                </strong>

              </div>

            </div>

            <div className="detail-description">

              <h3>
                Description
              </h3>

              <p>
                {item.description}
              </p>

            </div>

            <label className="field">

              <span>
                Item Status
              </span>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      ItemStatus,
                  )
                }
              >

                <option value="OPEN">
                  Available
                </option>

                <option value="MATCHED">
                  Potential Match
                </option>

                <option value="CLAIM_IN_PROGRESS">
                  Under Review
                </option>

                <option value="RESOLVED">
                  Returned
                </option>

                <option value="DONATED">
                  Donated
                </option>

                <option value="DISPOSED">
                  Disposed
                </option>

                <option value="ARCHIVED">
                  Archived
                </option>

              </select>

            </label>

            <button
              type="button"
              className="claim-button"
              onClick={saveChanges}
            >
              Save Changes
            </button>

            {message && (

              <p className="form-status">
                {message}
              </p>

            )}

          </div>

        </div>

      </section>

    </main>
  )
}

/* =================================
   REPORT FOUND ITEM
================================= */

function ReportFoundItemPage({
  onSubmitItem,
}: {
  onSubmitItem: (
    item: Omit<Item, 'id' | 'status'>,
  ) => void
}) {

  const [name, setName] =
    useState('')

  const [category, setCategory] =
    useState('')

  const [location, setLocation] =
    useState('')

  const [date, setDate] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [image, setImage] =
    useState('')

  const [message, setMessage] =
    useState('')

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault()

    if (
      !name ||
      !category ||
      !location ||
      !date ||
      !description
    ) {

      setMessage(
        'Please complete all required fields.',
      )

      return
    }

    onSubmitItem({
      name,
      category,
      location,
      date,
      description,
      image,
    })
  }

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="report-card">

        <button
          type="button"
          className="detail-back-button"
          onClick={() =>
            navigate('/staff-dashboard')
          }
        >
          ← Back to Staff Dashboard
        </button>

        <div className="card-heading">

          <p className="eyebrow">
            STAFF PORTAL
          </p>

          <h1>
            Report Found Item
          </h1>

          <p>
            Add information about an item that
            was found on campus.
          </p>

        </div>

        <form
          className="report-form"
          onSubmit={handleSubmit}
        >

          <div className="form-two-column">

            <label className="field">

              <span>
                Item Name *
              </span>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Black Wallet"
                required
              />

            </label>

            <label className="field">

              <span>
                Category *
              </span>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                required
              >

                <option value="">
                  Select category
                </option>

                <option value="Wallet">
                  Wallet
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="ID Card">
                  ID Card
                </option>

                <option value="Keys">
                  Keys
                </option>

                <option value="Bag">
                  Bag
                </option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </label>

          </div>

          <div className="form-two-column">

            <label className="field">

              <span>
                Location Found *
              </span>

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="e.g. AU Library"
                required
              />

            </label>

            <label className="field">

              <span>
                Date Found *
              </span>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                required
              />

            </label>

          </div>

          <label className="field">

            <span>
              Description *
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the item, including useful identifying details..."
              rows={5}
              required
            />

          </label>

          <label className="field">

            <span>
              Item Image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => {

                const file =
                  event.target.files?.[0]

                if (!file) {
                  return
                }

                const imageUrl =
                  URL.createObjectURL(file)

                setImage(imageUrl)
              }}
            />

          </label>

          {image && (

            <div className="image-preview">

              <img
                src={image}
                alt="Preview of found item"
              />

            </div>

          )}

          <button
            type="submit"
            className="submit-button"
          >
            Submit Found Item
          </button>

          {message && (

            <p className="form-status">
              {message}
            </p>

          )}

        </form>

      </section>

    </main>
  )
}

/* =================================
   FORGOT PASSWORD
================================= */

function ForgotPasswordPage() {

  const [message, setMessage] =
    useState('')

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="login-card">

        <button
          type="button"
          className="detail-back-button"
          onClick={() =>
            navigate('/student-login')
          }
        >
          ← Back to Login
        </button>

        <div className="card-heading">

          <p className="eyebrow">
            ACCOUNT RECOVERY
          </p>

          <h1>
            Forgot Password?
          </h1>

          <p>
            Enter your email address and we will
            send you instructions to reset your
            password.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={(event) => {

            event.preventDefault()

            setMessage(
              'Password reset will be connected to the authentication backend soon.',
            )

          }}
        >

          <label className="field">

            <span>
              Email Address
            </span>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

          </label>

          <button
            type="submit"
            className="submit-button"
          >
            Send Reset Instructions
          </button>

          {message && (

            <p className="form-status">
              {message}
            </p>

          )}

        </form>

      </section>

    </main>
  )
}

/* =================================
   STUDENT SIGN UP
================================= */

function StudentSignupPage() {

  const [message, setMessage] =
    useState('')

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="login-card">

        <button
          type="button"
          className="detail-back-button"
          onClick={() =>
            navigate('/student-login')
          }
        >
          ← Back to Student Login
        </button>

        <div className="card-heading">

          <p className="eyebrow">
            STUDENT ACCOUNT
          </p>

          <h1>
            Create Account
          </h1>

          <p>
            Create your AU student account to
            submit ownership claims.
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={(event) => {

            event.preventDefault()

            setMessage(
              'Student signup will be connected to the backend later.',
            )

          }}
        >

          <label className="field">

            <span>
              AU Student Email
            </span>

            <input
              type="email"
              placeholder="uID@au.edu"
              required
            />

          </label>

          <label className="field">

            <span>
              Password
            </span>

            <input
              type="password"
              placeholder="Create a password"
              required
            />

          </label>

          <label className="field">

            <span>
              Confirm Password
            </span>

            <input
              type="password"
              placeholder="Confirm your password"
              required
            />

          </label>

          <button
            type="submit"
            className="submit-button"
          >
            Create Student Account
          </button>

          {message && (

            <p className="form-status">
              {message}
            </p>

          )}

        </form>

      </section>

    </main>
  )
}

/* =================================
   ADMIN DASHBOARD
================================= */

function AdminDashboard({
  onLogout,
}: {
  onLogout: () => void
}) {

  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >

      <section className="dashboard-card">

        <div className="dashboard-header">

          <div>

            <p className="eyebrow">
              ADMIN PORTAL
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage users, categories, audit logs,
              and system settings.
            </p>

          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={onLogout}
          >
            Log out
          </button>

        </div>

        <div className="dashboard-grid">

          <button
            type="button"
            className="dashboard-action-card"
          >

            <span className="dashboard-icon">
              +
            </span>

            <strong>
              User Management
            </strong>

            <p>
              Manage staff and user accounts.
            </p>

          </button>

          <button
            type="button"
            className="dashboard-action-card"
          >

            <span className="dashboard-icon">
              #
            </span>

            <strong>
              Categories
            </strong>

            <p>
              Add or remove item categories.
            </p>

          </button>

          <button
            type="button"
            className="dashboard-action-card"
          >

            <span className="dashboard-icon">
              ◷
            </span>

            <strong>
              Audit Logs
            </strong>

            <p>
              Review system activity and records.
            </p>

          </button>

        </div>

      </section>

    </main>
  )
}

/* =================================
   APP
================================= */

function App() {

  const [pathname, setPathname] =
    useState(
      window.location.pathname,
    )

  const [items, setItems] =
    useState<Item[]>(initialItems)

  /*
    TEMPORARY FRONTEND ROLE.

    This will later be replaced with
    the real JWT authentication.
  */

  const [role, setRole] =
    useState<Role>(null)

  useEffect(() => {

    function handlePopState() {

      setPathname(
        window.location.pathname,
      )

    }

    window.addEventListener(
      'popstate',
      handlePopState,
    )

    return () => {

      window.removeEventListener(
        'popstate',
        handlePopState,
      )

    }

  }, [])

  /* =================================
     BACKEND HEALTH CHECK
  ================================= */

  useEffect(() => {

    async function checkBackend() {

      try {

        const response =
          await fetch(
            `${API_URL}/api/health`,
          )

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`,
          )
        }

        const data =
          await response.json()

        console.log(
          'Backend connected:',
          data,
        )

      } catch (error) {

        console.error(
          'Backend connection failed:',
          error,
        )

      }

    }

    checkBackend()

  }, [])

  /* =================================
     LOGIN
  ================================= */

  function loginAs(
    newRole: Role,
  ) {

    setRole(newRole)

    if (newRole === 'student') {

      navigate('/student-home')

      return
    }

    if (newRole === 'staff') {

      navigate('/staff-dashboard')

      return
    }

    if (newRole === 'admin') {

      navigate('/admin-dashboard')

      return
    }
  }

  /* =================================
     LOGOUT
  ================================= */

  function logout() {

    setRole(null)

    navigate('/')
  }

  /* =================================
     ADD ITEM
  ================================= */

  function handleAddItem(
    item: Omit<Item, 'id' | 'status'>,
  ) {

    const newItem: Item = {
      ...item,

      id:
        items.length > 0
          ? Math.max(
              ...items.map(
                (currentItem) =>
                  currentItem.id,
              ),
            ) + 1
          : 1,

      status: 'OPEN',
    }

    setItems((currentItems) => [
      newItem,
      ...currentItems,
    ])

    navigate(
      '/staff-dashboard',
    )
  }

  /* =================================
     UPDATE ITEM
  ================================= */

  function updateItem(
    updatedItem: Item,
  ) {

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id
          ? updatedItem
          : item,
      ),
    )
  }

  /* =================================
     STAFF ROUTES
  ================================= */

  if (
    pathname ===
      '/staff-dashboard' ||
    pathname ===
      '/staff/report-item' ||
    pathname ===
      '/staff/items' ||
    pathname.startsWith(
      '/staff/items/',
    )
  ) {

    if (role !== 'staff') {

      navigate('/staff-login')

      return null
    }

    if (
      pathname ===
      '/staff-dashboard'
    ) {

      return (
        <StaffDashboard
          items={items}
          onLogout={logout}
        />
      )
    }

    if (
      pathname ===
      '/staff/report-item'
    ) {

      return (
        <ReportFoundItemPage
          onSubmitItem={
            handleAddItem
          }
        />
      )
    }

    if (
      pathname ===
      '/staff/items'
    ) {

      return (
        <StaffManageItemsPage
          items={items}
        />
      )
    }

    const staffItemMatch =
      pathname.match(
        /^\/staff\/items\/(\d+)$/,
      )

    if (staffItemMatch) {

      const itemId =
        Number(
          staffItemMatch[1],
        )

      const item =
        items.find(
          (currentItem) =>
            currentItem.id === itemId,
        )

      if (!item) {

        navigate(
          '/staff/items',
        )

        return null
      }

      return (
        <StaffItemDetailPage
          item={item}
          onUpdateItem={
            updateItem
          }
        />
      )
    }

    navigate(
      '/staff-dashboard',
    )

    return null
  }

  /* =================================
     ADMIN ROUTE
  ================================= */

  if (
    pathname ===
    '/admin-dashboard'
  ) {

    if (role !== 'admin') {

      navigate('/admin-login')

      return null
    }

    return (
      <AdminDashboard
        onLogout={logout}
      />
    )
  }

  /* =================================
     PUBLIC ITEM DETAIL
  ================================= */

  const itemMatch =
    pathname.match(
      /^\/item\/(\d+)$/,
    )

  if (itemMatch) {

    if (role === 'staff') {

      navigate(
        '/staff-dashboard',
      )

      return null
    }

    const itemId =
      Number(
        itemMatch[1],
      )

    const item =
      items.find(
        (currentItem) =>
          currentItem.id === itemId,
      )

    if (!item) {

      navigate('/')

      return null
    }

    return (
      <ItemDetailPage
        item={item}
      />
    )
  }

  /* =================================
     STUDENT LOGIN
  ================================= */

  if (
    pathname ===
    '/student-login'
  ) {

    if (role === 'staff') {

      navigate(
        '/staff-dashboard',
      )

      return null
    }

    return (
      <LoginPage
        {...loginPages['/student-login']}
        onLogin={() =>
          loginAs('student')
        }
      />
    )
  }

  /* =================================
     STAFF LOGIN
  ================================= */

  if (
    pathname ===
    '/staff-login'
  ) {

    if (role === 'staff') {

      navigate(
        '/staff-dashboard',
      )

      return null
    }

    return (
      <LoginPage
        {...loginPages['/staff-login']}
        onLogin={() =>
          loginAs('staff')
        }
      />
    )
  }

  /* =================================
     ADMIN LOGIN
  ================================= */

  if (
    pathname ===
    '/admin-login'
  ) {

    if (role === 'staff') {

      navigate(
        '/staff-dashboard',
      )

      return null
    }

    return (
      <LoginPage
        {...loginPages['/admin-login']}
        onLogin={() =>
          loginAs('admin')
        }
      />
    )
  }

  /* =================================
     STUDENT SIGNUP
  ================================= */

  if (
    pathname ===
    '/student-signup'
  ) {

    if (role === 'staff') {

      navigate(
        '/staff-dashboard',
      )

      return null
    }

    return (
      <StudentSignupPage />
    )
  }

  /* =================================
     FORGOT PASSWORD
  ================================= */

  if (
    pathname ===
    '/forgot-password'
  ) {

    if (role === 'staff') {

      navigate(
        '/staff-dashboard',
      )

      return null
    }

    return (
      <ForgotPasswordPage />
    )
  }

  /* =================================
     STUDENT HOME
  ================================= */

  if (
    pathname ===
    '/student-home'
  ) {

    if (role !== 'student') {

      if (role === 'staff') {

        navigate(
          '/staff-dashboard',
        )

      } else {

        navigate(
          '/student-login',
        )

      }

      return null
    }

    return (
      <main
        className="page-shell"
        style={
          {
            '--page-background-image':
              `url(${campusImage})`,
          } as CSSProperties
        }
      >

        <section className="dashboard-card">

          <div className="dashboard-header">

            <div>

              <p className="eyebrow">
                STUDENT PORTAL
              </p>

              <h1>
                Student Home
              </h1>

              <p>
                Manage your claims and account.
              </p>

            </div>

            <button
              type="button"
              className="dashboard-logout"
              onClick={logout}
            >
              Log out
            </button>

          </div>

        </section>

      </main>
    )
  }

  /* =================================
     PUBLIC HOME
  ================================= */

  if (pathname === '/') {

    if (role === 'staff') {

      navigate(
        '/staff-dashboard',
      )

      return null
    }

    if (role === 'admin') {

      navigate(
        '/admin-dashboard',
      )

      return null
    }

    if (role === 'student') {

      navigate(
        '/student-home',
      )

      return null
    }

    return (
      <HomePage
        items={items}
      />
    )
  }

  /* =================================
     UNKNOWN ROUTE
  ================================= */

  navigate('/')

  return null
}

export default App