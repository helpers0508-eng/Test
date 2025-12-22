import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

const faqs = [
  {
    question: "How do I book a service?",
    answer: "Booking a service is simple! Browse our services, select the one you need, choose your preferred date and time, and complete the booking. You'll receive a confirmation email with all the details."
  },
  {
    question: "Are your helpers background checked?",
    answer: "Yes, all our helpers undergo thorough background checks, identity verification, and skill assessments before joining our platform. We also collect reviews and ratings from previous customers."
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer: "You can cancel or reschedule up to 24 hours before the service without any fees. For same-day cancellations, a small fee may apply. Contact us directly for assistance."
  },
  {
    question: "How do I become a helper?",
    answer: "To become a helper, sign up for an account with the 'helper' role, complete your profile with your skills and experience, and submit verification documents. Our team will review your application within 48 hours."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital wallets. Payments are processed securely through our payment partners."
  },
  {
    question: "Is there a minimum service charge?",
    answer: "Service charges vary by the type of service and duration. Most services start at $25, but some specialized services may have higher minimums."
  },
  {
    question: "What if the service doesn't meet my expectations?",
    answer: "Your satisfaction is our priority. If you're not happy with the service, contact us within 24 hours and we'll work to resolve the issue, which may include a refund or re-service."
  },
  {
    question: "Do you offer guarantees on work?",
    answer: "Yes, we offer satisfaction guarantees on most services. If there's an issue with the work performed, we'll arrange for corrections at no additional cost."
  },
  {
    question: "How do I leave a review?",
    answer: "After a service is completed, you'll receive an email with a link to rate and review your experience. Reviews help us maintain quality standards."
  },
  {
    question: "Are there any hidden fees?",
    answer: "No hidden fees! The price you see is the price you pay. Our platform fee is included in the service price shown to you."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-background-dark shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 text-white/80" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about our services, booking process, and platform.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:hidden" />
                  <ChevronUp className="w-5 h-5 text-gray-500 hidden group-open:block" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/services"
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/login" className="hover:text-primary">Sign In</Link></li>
                <li><Link href="/services" className="hover:text-primary">Browse Services</Link></li>
                <li><Link href="/about" className="hover:text-primary">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">For Customers</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/dashboard" className="hover:text-primary">My Bookings</Link></li>
                <li><Link href="/profile" className="hover:text-primary">My Profile</Link></li>
                <li><Link href="/book" className="hover:text-primary">Book Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">For Helpers</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/helper/dashboard" className="hover:text-primary">Helper Dashboard</Link></li>
                <li><Link href="/helper/profile" className="hover:text-primary">Helper Profile</Link></li>
                <li><Link href="/about" className="hover:text-primary">Become a Helper</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Support</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}