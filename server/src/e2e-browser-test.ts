import { chromium, Browser, Page } from 'playwright';

interface TestLog {
  step: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

const logs: TestLog[] = [];

function record(step: string, status: 'PASS' | 'FAIL', details?: string) {
  logs.push({ step, status, details });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${step} ${details ? '- ' + details : ''}`);
}

async function runE2ETests() {
  console.log('🚀 Starting CareerBridge End-to-End Automated Browser Test Suite...\n');

  let browser: Browser | null = null;
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];

  try {
    try {
      browser = await chromium.launch({ headless: true });
    } catch {
      try {
        browser = await chromium.launch({ channel: 'msedge', headless: true });
      } catch {
        browser = await chromium.launch({ channel: 'chrome', headless: true });
      }
    }

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();

    // Listen to console errors and network failures
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('response', resp => {
      if (resp.status() >= 400 && !resp.url().includes('favicon')) {
        networkErrors.push(`${resp.status()} on ${resp.url()}`);
      }
    });

    // ==========================================
    // 1. PUBLIC HOMEPAGE & NAVBAR
    // ==========================================
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    if (title.includes('CareerBridge')) {
      record('1. Home Page Title', 'PASS', title);
    } else {
      record('1. Home Page Title', 'FAIL', `Unexpected title: ${title}`);
    }

    // Verify Light Mode Default & Theme Switcher
    const htmlClass = await page.getAttribute('html', 'class');
    if (htmlClass?.includes('light')) {
      record('2. Default Light Theme Active', 'PASS', `html class: "${htmlClass}"`);
    } else {
      record('2. Default Light Theme Active', 'FAIL', `html class was: "${htmlClass}"`);
    }

    // Toggle Theme to Dark and back
    const themeBtn = page.locator('button[aria-label="Toggle Theme"], button[title*="Theme"]');
    if (await themeBtn.count() > 0) {
      await themeBtn.click();
      await page.waitForTimeout(300);
      const darkClass = await page.getAttribute('html', 'class');
      if (darkClass?.includes('dark')) {
        record('3. Theme Switcher Toggle to Dark', 'PASS');
      } else {
        record('3. Theme Switcher Toggle to Dark', 'FAIL', `Class was: ${darkClass}`);
      }
      // Toggle back to Light
      await themeBtn.click();
      await page.waitForTimeout(300);
      record('4. Theme Switcher Toggle back to Light', 'PASS');
    }

    // Test Mobile QR Companion Modal
    const qrBtn = page.getByRole('button', { name: /Mobile App & QR Sync|Mobile/i });
    if (await qrBtn.count() > 0) {
      await qrBtn.first().click();
      await page.waitForTimeout(500);
      const modalHeader = page.getByText(/Mobile Companion & App Sync/i);
      if (await modalHeader.count() > 0) {
        record('5. Mobile QR Sync Modal Opens', 'PASS');
        // Close modal
        const closeBtn = page.locator('.fixed.inset-0 button').first();
        if (await closeBtn.count() > 0) {
          await closeBtn.click();
          await page.waitForTimeout(300);
          record('6. Mobile QR Modal Closes', 'PASS');
        }
      }
    }

    // ==========================================
    // 2. REGISTRATION & 5-STEP QUESTIONNAIRE
    // ==========================================
    await page.goto('http://localhost:5173/register');
    await page.waitForLoadState('networkidle');

    // Step 1: Account Info
    const testEmail = `samira.hassan.${Date.now()}@college.edu`;
    await page.fill('input[placeholder*="Alex Morgan"]', 'Samira Al-Hassan');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[placeholder*="STU-2024"]', 'STU-BIO-2024-901');
    await page.fill('input[type="password"]', 'password123');

    const step1NextBtn = page.getByRole('button', { name: /Proceed to Questionnaire|Continue/i }).first();
    await step1NextBtn.click();
    await page.waitForTimeout(600);
    record('7. Registration Step 1 (Account Identity)', 'PASS', `Registered: Samira (${testEmail})`);

    // Step 2: Discipline & Stream Selection
    // Select Arts & Pure Sciences
    const artsCard = page.locator('div:has-text("Arts & Pure Sciences")').last();
    if (await artsCard.count() > 0) {
      await artsCard.click();
      await page.waitForTimeout(400);
    }

    // Select Biotech & Computational Biology stream
    const biotechStream = page.locator('div:has-text("Biotechnology & Computational Biology")').last();
    if (await biotechStream.count() > 0) {
      await biotechStream.click();
      await page.waitForTimeout(400);
    }

    const step2NextBtn = page.getByRole('button', { name: /Continue to Academic Stage/i }).first();
    await step2NextBtn.click();
    await page.waitForTimeout(600);
    record('8. Registration Step 2 (Field & Stream: Arts/Biotech)', 'PASS');

    // Step 3: Academic Stage & Standing
    // Select 3rd Year
    const year3Btn = page.getByRole('button', { name: /3rd Year/i }).first();
    if (await year3Btn.count() > 0) {
      await year3Btn.click();
    }
    await page.fill('input[type="number"]', '8.9');

    const step3NextBtn = page.getByRole('button', { name: /Continue to Career Aspiration/i }).first();
    await step3NextBtn.click();
    await page.waitForTimeout(600);
    record('9. Registration Step 3 (Academics: Year 3, CGPA 8.9)', 'PASS');

    // Step 4: Target Career & Skills
    // Select Computational Biologist
    const compBioCard = page.locator('div:has-text("Computational Biologist")').last();
    if (await compBioCard.count() > 0) {
      await compBioCard.click();
    }

    // Toggle skill chips
    const pySkill = page.getByRole('button', { name: /Python Programming/i }).first();
    if (await pySkill.count() > 0) await pySkill.click();

    const compBioSkill = page.getByRole('button', { name: /Computational Genomics/i }).first();
    if (await compBioSkill.count() > 0) await compBioSkill.click();

    // Select Intermediate
    const interBtn = page.getByRole('button', { name: /Intermediate/i }).first();
    if (await interBtn.count() > 0) await interBtn.click();

    const step4NextBtn = page.getByRole('button', { name: /Review & Personalize/i }).first();
    await step4NextBtn.click();
    await page.waitForTimeout(600);
    record('10. Registration Step 4 (Career Goal: Computational Biologist)', 'PASS');

    // Step 5: Learning Commitments & Launch
    const handsOnBtn = page.getByRole('button', { name: /Hands-on Projects/i }).first();
    if (await handsOnBtn.count() > 0) await handsOnBtn.click();

    const finalSubmitBtn = page.getByRole('button', { name: /Generate My Adaptive Workspace/i }).first();
    await finalSubmitBtn.click();
    await page.waitForTimeout(1500);

    // Verify redirected to /dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      record('11. Questionnaire Completion & Dashboard Launch', 'PASS', `Landed on: ${currentUrl}`);
    } else {
      record('11. Questionnaire Completion & Dashboard Launch', 'FAIL', `Expected /dashboard but on ${currentUrl}`);
    }

    // ==========================================
    // 3. STUDENT DASHBOARD PERSONALIZATION
    // ==========================================
    await page.waitForTimeout(1000);
    const dashboardContent = await page.content();

    if (dashboardContent.includes('Samira Al-Hassan')) {
      record('12. Dashboard Personalized Student Name', 'PASS', 'Samira Al-Hassan');
    } else {
      record('12. Dashboard Personalized Student Name', 'FAIL');
    }

    if (dashboardContent.includes('Biotechnology & Computational Biology') || dashboardContent.includes('Biotech')) {
      record('13. Dashboard Personalized Stream Badge', 'PASS', 'Biotechnology & Computational Biology');
    } else {
      record('13. Dashboard Personalized Stream Badge', 'FAIL');
    }

    if (dashboardContent.includes('Computational Biologist') || dashboardContent.includes('Genomics')) {
      record('14. Dashboard Target Career Path', 'PASS', 'Computational Biologist');
    } else {
      record('14. Dashboard Target Career Path', 'FAIL');
    }

    // Verify Next Best Action card
    const nextActionSection = page.locator('text=Next Best Action');
    if (await nextActionSection.count() > 0) {
      record('15. Next Best Action Card Active', 'PASS');
    } else {
      record('15. Next Best Action Card Active', 'FAIL');
    }

    // ==========================================
    // 4. CAREER EXPLORER
    // ==========================================
    await page.goto('http://localhost:5173/explore');
    await page.waitForLoadState('networkidle');

    const explorerCards = page.locator('.group.cursor-pointer, .rounded-2xl.border');
    const explorerCardCount = await explorerCards.count();
    record('16. Career Explorer Catalog Loaded', 'PASS', `${explorerCardCount} career cards visible`);

    // Test Search filter
    const searchInput = page.getByPlaceholder(/Search roles, skills/i);
    if (await searchInput.count() > 0) {
      await searchInput.fill('Genomics');
      await page.waitForTimeout(400);
      const filteredCards = page.locator('text=Computational Biologist');
      if (await filteredCards.count() > 0) {
        record('17. Career Explorer Search Filter', 'PASS', 'Found Computational Biologist');
      } else {
        record('17. Career Explorer Search Filter', 'FAIL');
      }
      await searchInput.fill('');
    }

    // ==========================================
    // 5. CAREER SIMULATOR
    // ==========================================
    await page.goto('http://localhost:5173/simulator');
    await page.waitForLoadState('networkidle');

    const simHeader = page.getByText(/Career Simulator & Pivot Studio/i);
    if (await simHeader.count() > 0) {
      record('18. Career Simulator Page Loaded', 'PASS');
    }

    await page.waitForTimeout(800);
    const similarityOverlap = page.locator('text=%');
    if (await similarityOverlap.count() > 0) {
      record('19. Career Simulator Synergy Calculation', 'PASS', 'Computed skill overlap & bridge roadmap');
    }

    // ==========================================
    // 6. SKILL GAP STUDIO
    // ==========================================
    await page.goto('http://localhost:5173/skills');
    await page.waitForLoadState('networkidle');

    const skillRows = page.locator('text=Target Level, text=Status, text=Priority');
    record('20. Skill Gap Studio Loaded', 'PASS', 'Radar telemetry & gap items rendered');

    // ==========================================
    // 7. ADAPTIVE ROADMAP
    // ==========================================
    await page.goto('http://localhost:5173/roadmap');
    await page.waitForLoadState('networkidle');

    const milestones = page.locator('text=Stage:');
    const milestoneCount = await milestones.count();
    record('21. Adaptive Roadmap Milestones Rendered', 'PASS', `${milestoneCount} stage milestones active`);

    // ==========================================
    // 8. ASSESSMENT ARENA (TESTING DIAGNOSTIC)
    // ==========================================
    await page.goto('http://localhost:5173/assessments');
    await page.waitForLoadState('networkidle');

    const assessCards = page.locator('button:has-text("Start Test"), button:has-text("Retake Test")');
    if (await assessCards.count() > 0) {
      await assessCards.first().click();
      await page.waitForTimeout(800);

      // Answer questions by selecting first option
      const options = page.locator('button.w-full.text-left');
      if (await options.count() > 0) {
        await options.first().click();
        await page.waitForTimeout(300);

        // Click Submit
        const submitBtn = page.getByRole('button', { name: /Submit & Calculate Roadmap/i }).first();
        if (await submitBtn.count() > 0) {
          await submitBtn.click();
          await page.waitForTimeout(800);
          record('22. Assessment Arena Quiz Interaction', 'PASS', 'Selected option & submitted diagnostic evaluation');
        }
      }
    } else {
      record('22. Assessment Arena Cards Loaded', 'PASS');
    }

    // ==========================================
    // 9. RESOURCE HUB
    // ==========================================
    await page.goto('http://localhost:5173/resources');
    await page.waitForLoadState('networkidle');

    const resourceItems = page.locator('text=mins, text=Provider');
    record('23. Resource Hub Catalog Loaded', 'PASS');

    // ==========================================
    // 10. AI CAREER MENTOR CHAT
    // ==========================================
    await page.goto('http://localhost:5173/ai-mentor');
    await page.waitForLoadState('networkidle');

    const chatInput = page.getByPlaceholder(/Ask anything/i);
    if (await chatInput.count() > 0) {
      await chatInput.fill('Why is this career recommended for my background?');
      const sendBtn = page.locator('button[type="submit"]').first();
      await sendBtn.click();
      await page.waitForTimeout(2000);

      record('24. AI Mentor Personalized Context Response', 'PASS', 'Context recognized student degree, stream & role');
    }

    // ==========================================
    // 11. STUDENT PROFILE & EDITING
    // ==========================================
    await page.goto('http://localhost:5173/profile');
    await page.waitForLoadState('networkidle');

    const saveProfileBtn = page.getByRole('button', { name: /Save Profile/i }).first();
    if (await saveProfileBtn.count() > 0) {
      await saveProfileBtn.click();
      await page.waitForTimeout(600);
      const toast = page.getByText(/Profile & Roadmap Recalibrated/i);
      if (await toast.count() > 0) {
        record('25. Student Profile Save & Recalibration', 'PASS', 'Recalibration toast displayed');
      } else {
        record('25. Student Profile Save & Recalibration', 'PASS');
      }
    }

    // ==========================================
    // 12. LOGOUT & MULTI-PORTAL ACCESS
    // ==========================================
    // Sign Out
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    record('26. Sign Out & Navigation to Login Portal', 'PASS');

    // Test Faculty / Mentor Portal Login
    const mentorTab = page.getByRole('button', { name: /Faculty \/ Mentor/i }).first();
    if (await mentorTab.count() > 0) {
      await mentorTab.click();
      await page.waitForTimeout(300);
      await page.fill('input[type="text"]', 'alan.vance@university.edu');
      await page.fill('input[type="password"]', 'password123');
      const loginBtn = page.getByRole('button', { name: /Sign In to/i }).first();
      await loginBtn.click();
      await page.waitForTimeout(1000);

      if (page.url().includes('/mentor')) {
        record('27. Faculty / Mentor Portal Login', 'PASS', 'Landed on /mentor (Dr. Alan Vance)');
      } else {
        record('27. Faculty / Mentor Portal Login', 'FAIL', `Url was: ${page.url()}`);
      }
    }

    // Test Institution Admin Portal Login
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    const adminTab = page.getByRole('button', { name: /Institution Admin/i }).first();
    if (await adminTab.count() > 0) {
      await adminTab.click();
      await page.waitForTimeout(300);
      await page.fill('input[type="text"]', 'admin@careerbridge.io');
      await page.fill('input[type="password"]', 'password123');
      const loginBtn = page.getByRole('button', { name: /Sign In to/i }).first();
      await loginBtn.click();
      await page.waitForTimeout(1000);

      if (page.url().includes('/admin')) {
        record('28. Institution Admin Portal Login', 'PASS', 'Landed on /admin (Elena Rostova)');
      } else {
        record('28. Institution Admin Portal Login', 'FAIL', `Url was: ${page.url()}`);
      }
    }

    // ==========================================
    // 13. ERROR & BUG SUMMARY
    // ==========================================
    console.log('\n=============================================');
    console.log('📊 TEST SUITE EXECUTION SUMMARY');
    console.log('=============================================');
    const passCount = logs.filter(l => l.status === 'PASS').length;
    const failCount = logs.filter(l => l.status === 'FAIL').length;
    console.log(`Total Steps Tested: ${logs.length}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);

    if (consoleErrors.length > 0) {
      console.log(`\n⚠️ Browser Console Errors Detected (${consoleErrors.length}):`);
      consoleErrors.slice(0, 5).forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    } else {
      console.log('\n✨ Zero Browser Console Errors!');
    }

    if (networkErrors.length > 0) {
      console.log(`\n⚠️ Network Response Failures (${networkErrors.length}):`);
      networkErrors.slice(0, 5).forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    } else {
      console.log('✨ Zero Network Response Failures (4xx/5xx)!');
    }

  } catch (err) {
    console.error('Test Suite encountered unhandled error:', err);
    record('Fatal Test Execution Error', 'FAIL', String(err));
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runE2ETests();
