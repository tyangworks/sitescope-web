# Analytics Events

SiteScope uses the existing `trackGrowth` adapter. Events contain no report
content, website URLs, report IDs, email addresses, payment data, or query
strings.

| Event | Trigger | Purpose |
| --- | --- | --- |
| `homepage_viewed` | Homepage becomes active | Measure acquisition entry traffic |
| `audit_started` | Existing audit flow starts | Measure audit intent |
| `audit_submitted` | Valid audit request is submitted | Measure completed form submission |
| `audit_completed` | Existing audit completion signal | Measure successful audit completion |
| `report_viewed` | Existing report view signal | Measure report engagement |
| `login_started` | Magic Link or OAuth button is submitted | Measure authentication intent |
| `login_completed` | Provider callback completes where configured | Measure successful authentication |
| `report_claimed` | Anonymous report is claimed after login | Measure free-account conversion |
| `pro_upgrade_clicked` | Pro CTA is clicked | Measure upgrade intent |
| `checkout_started` | Checkout flow starts | Measure billing intent |
| `checkout_completed` | Confirmed checkout return signal | Measure completed checkout |
| `service_clicked` | Services/contact CTA is clicked | Measure services interest |
| `service_selected` | Services page consultation CTA is clicked | Measure qualified service intent |
| `contact_started` | Contact form receives input | Measure lead-form engagement |
| `contact_submitted` | Contact form passes validation and is sent | Measure lead conversion |
| `donation_clicked` | PayPal support link is clicked | Measure optional support interest |
| `sample_report_viewed` | Sample report becomes active | Measure product education engagement |
| `geo_landing_viewed` | GEO landing page becomes active | Measure AI-search positioning interest |
| `content_audit_cta_clicked` | Content CTA links to audit | Measure content-to-audit funnel |

`service_lead_submitted` and `signup_started` remain in the type union for
backward compatibility with existing dashboards; new UI code uses the more
specific `contact_submitted` and `login_started` events.
