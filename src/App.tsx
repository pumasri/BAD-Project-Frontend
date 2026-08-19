import { useEffect, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import campusImage from '../public/abacCampus.jpeg'
import './App.css'

const API_URL = 'http://localhost:5050'

type Role = 'student' | 'staff' | 'admin'

type LoginPageConfig = {
  role: Role
  title: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  showSignup?: boolean
  helpMessage: string
  signupMessage?: string
  dashboardPath: string
}

const loginPages: Record<string, LoginPageConfig> = {
  '/student-login': {
    role: 'student',
    title: 'Student Login',
    description:
      'Use your AU student email and password to continue.',
    emailLabel: 'AU Student Email',
    emailPlaceholder: 'uID@au.edu',
    showSignup: true,
    helpMessage:
      'Student support is not connected.',
    dashboardPath: '/student-dashboard',
  },

  '/staff-login': {
    role: 'staff',
    title: 'Staff Login',
    description: '',
    emailLabel: 'Staff Email',
    emailPlaceholder: 'staffID@au.edu',
    helpMessage:
      'Staff support is not connected.',
    dashboardPath: '/staff-dashboard',
  },

  '/admin-login': {
    role: 'admin',
    title: 'Admin Login',
    description: '',
    emailLabel: 'Admin Email',
    emailPlaceholder: 'adminID@au.edu',
    helpMessage:
      'Administrator support is not connected.',
    dashboardPath: '/admin-dashboard',
  },
}

const basePath = new URL(
  import.meta.env.BASE_URL,
  window.location.origin,
).pathname.replace(/\/$/, '')

/* ================================
   NAVIGATION
================================ */

function withBasePath(path: string) {
  return `${basePath}${path}` || path
}

function navigate(path: string) {
  window.history.pushState(
    {},
    '',
    withBasePath(path),
  )

  window.dispatchEvent(
    new PopStateEvent('popstate'),
  )
}

function getAppPathname() {
  const pathname = window.location.pathname

  if (
    basePath &&
    pathname.startsWith(basePath)
  ) {
    const normalizedPath = pathname.slice(
      basePath.length,
    )

    return normalizedPath || '/'
  }

  return pathname
}

/* ================================
   LOGIN PAGE
================================ */

function LoginPage({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  showSignup = false,
  helpMessage,
  dashboardPath,
}: LoginPageConfig) {
  const titleId = `${title
    .toLowerCase()
    .replace(/\s+/g, '-')}-title`

  const [submitMessage, setSubmitMessage] =
    useState('')

  const [supportMessage, setSupportMessage] =
    useState('')

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setSubmitMessage('')
    setSupportMessage('')

    /*
     * TEMPORARY:
     * The login is not connected to the
     * authentication API yet.
     *
     * For now, clicking Log in navigates
     * to the correct dashboard.
     */
    navigate(dashboardPath)
  }

  function handleHelpClick() {
    setSupportMessage(helpMessage)
    setSubmitMessage('')
  }

  function handleSignupClick() {
    setSupportMessage('')
    setSubmitMessage('')

    navigate('/student-signup')
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
      <section
        className="login-card"
        aria-labelledby={titleId}
      >
        <div className="card-heading">
          <h1 id={titleId}>
            {title}
          </h1>

          {description && (
            <p>{description}</p>
          )}
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          {/* EMAIL */}

          <label className="field">
            <span>{emailLabel}</span>

            <input
              type="email"
              name="email"
              placeholder={emailPlaceholder}
              autoComplete="email"
              required
            />
          </label>

          {/* PASSWORD */}

          <label className="field">
            <span>Password</span>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {/* REMEMBER + HELP */}

          <div className="form-row">
            <label className="checkbox">
              <input
                type="checkbox"
                name="remember"
              />

              <span>
                Keep me signed in
              </span>
            </label>

            <button
              type="button"
              className="text-link text-button"
              onClick={handleHelpClick}
            >
              Need help?
            </button>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="submit-button"
          >
            Log in
          </button>

          {/* LOGIN MESSAGE */}

          {submitMessage ? (
            <p
              className="form-status"
              role="status"
            >
              {submitMessage}
            </p>
          ) : null}

          {/* HELP MESSAGE */}

          {supportMessage ? (
            <p
              className="form-status"
              role="status"
            >
              {supportMessage}
            </p>
          ) : null}
        </form>

        {/* STUDENT SIGN UP */}

        {showSignup ? (
          <p className="signup-section">
            Don&apos;t have an account?{' '}

            <button
              type="button"
              className="text-link text-button"
              onClick={handleSignupClick}
            >
              Sign up
            </button>
          </p>
        ) : null}
      </section>
    </main>
  )
}

/* ================================
   DASHBOARD PAGE
================================ */

function DashboardPage({
  title,
  description,
  loginPath,
}: {
  title: string
  description: string
  loginPath: string
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
      <section className="login-card route-card">
        <h1>{title}</h1>

        <p>{description}</p>

        <button
          type="button"
          className="submit-button"
          onClick={() => navigate(loginPath)}
        >
          Back to Login
        </button>
      </section>
    </main>
  )
}

/* ================================
   STUDENT SIGN UP
================================ */

function StudentSignupPage() {
  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="login-card route-card">
        <h1>Student Sign Up</h1>

        <p>
          Student registration will be
          connected to the backend later.
        </p>

        <button
          type="button"
          className="submit-button"
          onClick={() =>
            navigate('/student-login')
          }
        >
          Back to Student Login
        </button>
      </section>
    </main>
  )
}

/* ================================
   FALLBACK
================================ */

function RouteFallback() {
  return (
    <main
      className="page-shell"
      style={
        {
          '--page-background-image': `url(${campusImage})`,
        } as CSSProperties
      }
    >
      <section className="login-card route-card">
        <h1>
          Campus Lost &amp; Found
        </h1>

        <p>
          Choose one of the dedicated login
          routes for the right experience.
        </p>

        <div
          className="route-links"
          aria-label="Available login routes"
        >
          <button
            type="button"
            className="primary-link"
            onClick={() =>
              navigate('/student-login')
            }
          >
            Student Login
          </button>

          <button
            type="button"
            className="primary-link"
            onClick={() =>
              navigate('/staff-login')
            }
          >
            Staff Login
          </button>

          <button
            type="button"
            className="primary-link"
            onClick={() =>
              navigate('/admin-login')
            }
          >
            Admin Login
          </button>
        </div>
      </section>
    </main>
  )
}

/* ================================
   APP
================================ */

function App() {
  const [pathname, setPathname] =
    useState(getAppPathname())

  /* ================================
     BROWSER BACK / FORWARD
  ================================= */

  useEffect(() => {
    const handlePopState = () => {
      setPathname(getAppPathname())
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

  /* ================================
     BACKEND CONNECTION TEST
  ================================= */

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(
          `${API_URL}/api/health`,
        )

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`,
          )
        }

        const data = await response.json()

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

  /* ================================
     LOGIN ROUTES
  ================================= */

  const page = loginPages[pathname]

  if (page) {
    return <LoginPage {...page} />
  }

  /* ================================
     STUDENT SIGN UP
  ================================= */

  if (pathname === '/student-signup') {
    return <StudentSignupPage />
  }

  /* ================================
     STUDENT DASHBOARD
  ================================= */

  if (
    pathname === '/student-dashboard'
  ) {
    return (
      <DashboardPage
        title="Student Dashboard"
        description="Welcome to the Student Portal."
        loginPath="/student-login"
      />
    )
  }

  /* ================================
     STAFF DASHBOARD
  ================================= */

  if (
    pathname === '/staff-dashboard'
  ) {
    return (
      <DashboardPage
        title="Staff Dashboard"
        description="Welcome to the Staff Portal."
        loginPath="/staff-login"
      />
    )
  }

  /* ================================
     ADMIN DASHBOARD
  ================================= */

  if (
    pathname === '/admin-dashboard'
  ) {
    return (
      <DashboardPage
        title="Admin Dashboard"
        description="Welcome to the Admin Portal."
        loginPath="/admin-login"
      />
    )
  }

  /* ================================
     UNKNOWN URL
  ================================= */

  return <RouteFallback />
}

export default App