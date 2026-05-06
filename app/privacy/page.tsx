export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 md:p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-slate-600 leading-7">
          <p>
            SiteScope collects website URLs submitted for analysis and stores generated
            report data on sitescope.fyi to deliver the service.
          </p>
          <p>
            If you purchase an unlock, your email is shared with Stripe only for payment
            processing and receipts. SiteScope does not store raw card data.
          </p>
          <p>
            We use service providers such as Stripe and Supabase to operate the platform.
            Data is retained only as needed to provide reports and support.
          </p>
          <p>
            For privacy requests, contact us using the email listed in the footer.
          </p>
        </div>
      </div>
    </main>
  );
}
