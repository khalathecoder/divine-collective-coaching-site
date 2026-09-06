import BrandShell from "@/components/BrandShell";

export function PrivacyPolicy() {
  return (
    <BrandShell currentPath="/privacy">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-16 lg:py-20 border-b border-brand-plum/35 bg-black text-cream">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(139,92,246,0.1)" stroke-width="1"/></pattern></defs><rect width="1200" height="600" fill="rgba(15,23,42,0.8)"/><rect width="1200" height="600" fill="url(%23grid)"/><circle cx="200" cy="150" r="200" fill="rgba(139,92,246,0.05)"/><circle cx="1000" cy="450" r="250" fill="rgba(217,119,6,0.03)"/></svg>')`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.82)_42%,rgba(0,0,0,0.38)_100%)]" />
        <div className="container relative z-10">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow">PRIVACY & TRUST</p>
            <h1 className="font-display text-4xl leading-[0.96] text-cream sm:text-5xl lg:text-6xl">
              Privacy <span className="text-brand-gold">Policy</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="relative overflow-hidden py-16 md:py-20 border-b border-brand-plum/35 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-brand-plum/20">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217, 119, 6, 0.1) 0%, transparent 50%)` }} />
        <div className="container max-w-4xl relative z-10">
          <div className="prose prose-invert max-w-none space-y-8 text-cream/80">
            {/* Last Updated */}
            <div className="mb-8 pb-8 border-b border-brand-plum/35">
              <p className="text-sm text-brand-plum uppercase tracking-wider">Last updated: March 2026</p>
            </div>

            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-base leading-8">
                Divine Collective LLC together with its affiliated entities ("Divine Collective LLC") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share data, and what choices you have with respect to your data. We have updated this version of our Privacy Policy to reflect changes in data protection law.
              </p>
            </div>

            {/* Fundamental Principles */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">Our Fundamental Principles</h2>
              <div className="space-y-3 pl-6 border-l-2 border-brand-gold">
                <p className="text-base leading-8">
                  <span className="text-brand-gold font-semibold">I.</span> We are thoughtful about the personal data we ask you to provide and the personal information that we collect about you through the operation of our services.
                </p>
                <p className="text-base leading-8">
                  <span className="text-brand-gold font-semibold">II.</span> We store personal information for no longer than we really have a need to keep it or when it is required by law.
                </p>
                <p className="text-base leading-8">
                  <span className="text-brand-gold font-semibold">III.</span> We aim to make it as simple as possible for you to control what information on this website is shared publicly (or kept private), indexed by search engines, and permanently deleted.
                </p>
                <p className="text-base leading-8">
                  <span className="text-brand-gold font-semibold">IV.</span> We aim for full transparency on how we gather, use, and share your personal information.
                </p>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">1. What Personal Information Do We Collect?</h2>
              <p className="text-base leading-8">We collect personal information about you in the following ways:</p>
              
              <div className="space-y-4 pl-6">
                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">1.1 Information You Give Us</h3>
                  <ul className="space-y-2 text-base leading-8">
                    <li>• Personal and Business Contact information provided via registration form, such as your first name, last name, email address, telephone number, your role</li>
                    <li>• Content you post on our Site (text, images, photographs, messages, comments, or any other kind of content)</li>
                    <li>• Feedback and correspondence, such as information you provide in surveys or when you contact us</li>
                    <li>• Transaction information, such as details about subscription to our Services and billing details</li>
                    <li>• Marketing information, such as your preferences for receiving marketing communications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">1.2 Information from Social Networking Sites</h3>
                  <p className="text-base leading-8">You may choose to connect to our Services via your Facebook social media account. Information we receive typically includes your basic public profile information such as username, profile picture, age range, gender, and date of birth.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">1.3 Information Automatically Collected</h3>
                  <p className="text-base leading-8">We may automatically log information about you and your computer or mobile device when you access our Site, including operating system, browser type, pages viewed, and broad geographic location based on your IP address. We collect this information using cookies.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">1.4 No Special Categories of Information</h3>
                  <p className="text-base leading-8">We do not request or intend to collect any "special categories of information" such as information on health, race, religion, political opinions or philosophical beliefs, sexual preferences or orientation.</p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">2. How We Use Your Personal Information</h2>
              <div className="space-y-4 pl-6">
                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">2.1 To Provide and Operate Our Services</h3>
                  <ul className="space-y-2 text-base leading-8">
                    <li>• To create user accounts/profiles to enable you to use our Services</li>
                    <li>• To send you service related communications including confirmations, technical notices, updates, security alerts, and support/administrative messages</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">2.2 To Improve Our Services and Keep Them Secure</h3>
                  <ul className="space-y-2 text-base leading-8">
                    <li>• To respond to your customer support requests</li>
                    <li>• To detect and prevent illegal activities</li>
                    <li>• To conduct optional user feedback surveys</li>
                    <li>• To carry out research and better understand your needs</li>
                    <li>• To provide support and maintenance for the Site and our Services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">2.3 To Personalize Our Services</h3>
                  <ul className="space-y-2 text-base leading-8">
                    <li>• To remember you next time you visit our Site</li>
                    <li>• To communicate with you about promotions, upcoming events, and other news about products and services offered by us</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">2.4 For Compliance, Fraud Prevention and Safety</h3>
                  <ul className="space-y-2 text-base leading-8">
                    <li>• To comply with our legal obligations</li>
                    <li>• To exercise, establish or defend our legal rights</li>
                    <li>• To prevent and/or detect fraud or fraudulent behavior</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-brand-gold mb-2">2.5 Use of Credit Card Information</h3>
                  <p className="text-base leading-8">If you give us credit card information, we use it solely to check your financial qualifications and collect payment from you. We use a third-party service provider to manage credit card processing. We will never sell your personal information to any third party.</p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">3. Cookies and Similar Tracking Technology</h2>
              <p className="text-base leading-8">
                The Services may use "cookies" and other technologies such as pixel tags, local shared objects, hardware-based device identifiers, flash cookies, operating system-based identifiers, clear GIFs and web beacons. A "cookie" is a small file stored by your device when told to do so by a website. Cookies are personal information. However, our cookies do not include any other personal information and are typically used to quickly identify your device and to "remember" your device during subsequent visits for purposes of functionality, preferences, and website performance.
              </p>
              <p className="text-base leading-8">
                You can disable cookies on your device or set your device to alert you when cookies are being sent to your device; however, disabling cookies may affect your ability to use the Services.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">4. Legal Basis for Processing Personal Information</h2>
              <p className="text-base leading-8">
                Our legal basis for collecting and using the personal information described above will depend on the personal information concerned and the specific context in which we collect it. However, we will normally collect personal information from you only where we need the personal information to perform a contract with you, where the processing is in our legitimate interests and not overridden by your rights, or where we have your consent to do so.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">5. Who We Share Your Personal Information With</h2>
              <p className="text-base leading-8">We may share your personal information to the following categories of recipients:</p>
              <ul className="space-y-3 pl-6 text-base leading-8">
                <li>• To our group companies, third party services providers and partners who provide data processing services to us</li>
                <li>• To any competent law enforcement body, regulatory, government agency, court or other third party where we believe disclosure is necessary</li>
                <li>• To a potential or actual buyer in connection with any proposed or actual purchase, merger or acquisition of any part of our business</li>
                <li>• To any other person with your consent to the disclosure</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">6. How We Keep Your Personal Information Secure</h2>
              <p className="text-base leading-8">
                We use appropriate technical and organizational measures designed to protect the personal information that we collect and process about you. Specific measures we use include encrypting your personal information in transit and at rest. We also have security policies and data processing agreements with all our employees and contractors.
              </p>
              <p className="text-base leading-8">
                You acknowledge that no perfect security infrastructure exists and no data transmission is guaranteed to be 100% secure. You are responsible for your login information and password. In case your privacy has been breached, please contact us immediately.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">7. Location of the Processing of Personal Data</h2>
              <p className="text-base leading-8">
                The personal data collected by Divine Collective LLC is processed at the company's offices in Ohio. Our servers for storing the data are located in South Euclid, Ohio.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">8. International Data Transfers</h2>
              <p className="text-base leading-8">
                Your personal information may be transferred to, and processed in, countries other than the country in which you are resident. These countries may have data protection laws that are different to the laws of your country. We ensure appropriate safeguards are in place so that your personal information will remain protected in accordance with this Privacy Policy.
              </p>
              <p className="text-base leading-8">
                By providing your data to us you agree to this transfer taking place. No third party providers have access to your data, unless specifically required by law, where you have consented with us to do so, or in order to provide our Services to you.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">9. Data Retention</h2>
              <p className="text-base leading-8">
                We retain personal information we collect from you where we have an ongoing legitimate business need to do so, for example, to provide you with a Service you have requested or to comply with applicable legal, tax or accounting requirements. When we have no ongoing legitimate business need to process your personal information, we will either erase or de-identify it or, if this is not possible, then we will securely store your personal information and isolate it from any further processing until erasure is possible.
              </p>
            </div>

            {/* Section 10 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">10. Your Data Protection Rights</h2>
              <p className="text-base leading-8">You have the following data protection rights:</p>
              <ul className="space-y-3 pl-6 text-base leading-8">
                <li>• <span className="text-brand-gold font-semibold">A.</span> To access, correct, update or request deletion of your personal information</li>
                <li>• <span className="text-brand-gold font-semibold">B.</span> To object to processing of your personal information</li>
                <li>• <span className="text-brand-gold font-semibold">C.</span> To opt-out of marketing communications we send you at any time</li>
                <li>• <span className="text-brand-gold font-semibold">D.</span> If we are processing your personal information with your consent, you can withdraw your consent at any time</li>
                <li>• <span className="text-brand-gold font-semibold">E.</span> You have the right to complain to a data protection authority about our collection and use of your personal information</li>
              </ul>
              <p className="text-base leading-8 mt-4">
                We will respond to all requests we receive from individuals wishing to exercise their data protection rights in accordance with applicable data protection laws.
              </p>
            </div>

            {/* Section 11 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">11. Age Limit</h2>
              <p className="text-base leading-8">
                Our Services are not directed to children under the age of 18, and we do not intentionally gather personal information from visitors who are under the age of 18, without their parental or guardian's consent. If a parent or guardian becomes aware that his or her child has provided us with information without their consent, he or she should contact us. We will delete such information from our files as soon as reasonably practicable.
              </p>
            </div>

            {/* Section 12 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display text-cream">12. Updates to This Privacy Notice</h2>
              <p className="text-base leading-8">
                We may update this Privacy Notice from time to time in response to changing legal, technical or business developments. When we update our Privacy Notice, we will take appropriate measures to inform you, consistent with the significance of the changes we make.
              </p>
            </div>

            {/* Section 13 */}
            <div className="space-y-4 pt-8 border-t border-brand-plum/35">
              <h2 className="text-2xl font-display text-cream">13. How to Contact Us</h2>
              <div className="space-y-2 text-base leading-8">
                <p><span className="text-brand-gold font-semibold">Data Controller:</span> Divine Collective LLC</p>
                <p><span className="text-brand-gold font-semibold">Address:</span> 3765 Grosvenor Rd, South Euclid, OH 44118</p>
                <p><span className="text-brand-gold font-semibold">Email:</span> <a href="mailto:info@dicollectivellc.com" className="text-brand-gold hover:text-brand-gold/80 transition">info@dicollectivellc.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BrandShell>
  );
}
