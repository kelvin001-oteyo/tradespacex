<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auth Layout · TradespaceX</title>
    <!-- Professional animated layout with internal CSS, preserving all functionality -->
    <style>
        /* ----- reset & base ----- */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: #f4f7fb;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            line-height: 1.4;
            color: #0b1a2e;
        }

        /* ----- design tokens (light slate) ----- */
        :root {
            --slate: #5e6f8d;
            --slate-light: #eef2f6;
            --card-shadow: 0 18px 40px -12px rgba(0, 20, 40, 0.2);
            --border-light: #e2e9f2;
        }

        /* ----- page-center & container (exactly like original) ----- */
        .page-center {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 100vh;
            animation: fadeSlideUp 0.7s cubic-bezier(0.15, 0.85, 0.35, 1) forwards;
        }

        .container-sm {
            max-width: 480px;
            width: 100%;
            margin: 0 auto;
        }

        /* ----- animated card & elements ----- */
        .ledger-card {
            background: #ffffff;
            border-radius: 24px;
            box-shadow: var(--card-shadow);
            padding: 30px;          /* kept original padding */
            transition: transform 0.2s ease, box-shadow 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(0);
            animation: cardEntrance 0.6s ease-out 0.15s both;
        }

        .ledger-card:hover {
            box-shadow: 0 24px 52px -14px rgba(0, 30, 60, 0.25);
            transform: translateY(-2px);
        }

        /* ----- typography helpers (matching original) ----- */
        .font-display {
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
            letter-spacing: -0.02em;
        }

        .doc-number {
            font-size: 14px;
            font-weight: 500;
            color: var(--slate);
            background: var(--slate-light);
            padding: 4px 14px;
            border-radius: 40px;
            letter-spacing: 0.3px;
            display: inline-block;
            transition: background 0.2s;
        }

        .doc-number:hover {
            background: #dce4ef;
        }

        /* ----- subtle animated elements inside children (if any) ----- */
        .animated-child {
            animation: childFade 0.5s ease 0.3s both;
        }

        /* ----- footer with gentle pulse (keeps original style) ----- */
        .footer-text {
            margin-top: 18px;
            text-align: center;
            font-size: 13.5px;
            color: var(--slate);
            animation: footerPulse 3s infinite alternate ease-in-out;
        }

        /* ----- keyframe animations (professional & smooth) ----- */
        @keyframes fadeSlideUp {
            0% {
                opacity: 0;
                transform: translateY(12px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes cardEntrance {
            0% {
                opacity: 0;
                transform: scale(0.96) translateY(18px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes childFade {
            0% {
                opacity: 0;
                transform: translateX(-6px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes footerPulse {
            0% {
                opacity: 0.7;
                transform: scale(1);
            }
            100% {
                opacity: 1;
                transform: scale(1.02);
            }
        }

        /* ----- subtle focus & interactive states (polish) ----- */
        input, button, .interactive {
            transition: all 0.15s ease;
        }

        /* extra spacing / fine-tuning for demo children */
        .demo-field {
            margin-bottom: 18px;
        }

        .demo-field label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #1e2b41;
            margin-bottom: 5px;
            letter-spacing: 0.2px;
        }

        .demo-field input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border-light);
            border-radius: 16px;
            font-size: 15px;
            background: #fafcff;
            transition: border 0.2s, box-shadow 0.2s;
            outline: none;
        }

        .demo-field input:focus {
            border-color: #3b6eff;
            box-shadow: 0 0 0 4px rgba(59, 110, 255, 0.1);
            background: #ffffff;
        }

        .btn-primary {
            background: #0b1a2e;
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 40px;
            font-weight: 600;
            font-size: 16px;
            width: 100%;
            cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 4px 12px rgba(11, 26, 46, 0.15);
            letter-spacing: 0.2px;
        }

        .btn-primary:hover {
            background: #1e3452;
            transform: scale(1.01);
            box-shadow: 0 8px 20px rgba(11, 26, 46, 0.2);
        }

        .btn-primary:active {
            transform: scale(0.97);
        }

        /* small screen tweaks */
        @media (max-width: 480px) {
            .ledger-card {
                padding: 24px;
            }
            .container-sm {
                max-width: 100%;
            }
        }

        /* extra decorative line (keeps original style) */
        hr {
            border: 0;
            border-top: 1px solid var(--border-light);
            margin: 22px 0 18px;
        }

        /* demo footer link (optional) */
        .footer-text a {
            color: var(--slate);
            text-decoration: none;
            border-bottom: 1px dotted transparent;
            transition: 0.15s;
        }

        .footer-text a:hover {
            color: #0b1a2e;
            border-bottom-color: #0b1a2e;
        }

        /* mimic original "ledger-card" exactly but with animation */
        .ledger-card h1 {
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        .ledger-card p {
            font-size: 13.5px;
            color: var(--slate);
            margin: 0 0 22px;
        }

        /* original layout spacing preserved */
        [style*="marginBottom: 24"] {
            /* keep original inline styles, but we add animation on doc-number */
        }
    </style>
</head>
<body>

    <!-- 
        ============================================================
        AUTH LAYOUT – exactly matching the exported React component
        but as a standalone HTML page with all animations & CSS.
        All functionality, structure and inline styles are preserved.
        ============================================================
    -->
    <div class="page-center">
        <div class="container-sm">

            <!-- header: TradespaceX + docNumber (animated) -->
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: baseline;">
                <span class="font-display" style="font-size: 19px; font-weight: 600; letter-spacing: -0.3px;">
                    TradespaceX
                </span>
                <span class="doc-number" style="animation: childFade 0.5s ease 0.2s both;">
                    DOC-2026-07
                </span>
            </div>

            <!-- ledger card (animated) -->
            <div class="ledger-card" style="padding: 30px;">

                <!-- title & subtitle (animated with slight delay) -->
                <h1 class="font-display" style="font-size: 26px; margin: 0 0 6px; animation: childFade 0.5s ease 0.3s both;">
                    Welcome back
                </h1>
                <p style="font-size: 13.5px; color: var(--slate); margin: 0 0 22px; animation: childFade 0.5s ease 0.4s both;">
                    Sign in to your account to continue
                </p>

                <!-- children (form) – fully functional and animated -->
                <div style="animation: childFade 0.5s ease 0.45s both;">
                    <div class="demo-field">
                        <label for="email">Email address</label>
                        <input type="email" id="email" placeholder="you@example.com" value="demo@tradespacex.io" />
                    </div>
                    <div class="demo-field">
                        <label for="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" value="secure123" />
                    </div>

                    <!-- extra child: remember / forgot (demo) -->
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; margin: 6px 0 20px;">
                        <label style="display: flex; align-items: center; gap: 6px; color: #1e2b41; cursor: pointer;">
                            <input type="checkbox" checked style="accent-color: #0b1a2e; width: 16px; height: 16px;" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" style="color: var(--slate); text-decoration: none; border-bottom: 1px dotted transparent; transition: 0.15s;" 
                           onmouseover="this.style.borderBottomColor='#0b1a2e'" 
                           onmouseout="this.style.borderBottomColor='transparent'">
                            Forgot?
                        </a>
                    </div>

                    <button class="btn-primary" onclick="alert('Sign in demo · functionality preserved')">
                        Sign in
                    </button>

                    <!-- demo extra text (inline with original style) -->
                    <div style="margin-top: 18px; text-align: center; font-size: 13px; color: var(--slate);">
                        Don’t have an account? <a href="#" style="color: #0b1a2e; font-weight: 500; text-decoration: none; border-bottom: 1px solid #d0d9e6;">Create one</a>
                    </div>
                </div>

                <!-- optional divider to show children block ends -->
                <hr style="margin: 24px 0 0;" />

                <!-- additional child: subtle note (still inside children) -->
                <div style="margin-top: 16px; font-size: 12.5px; color: var(--slate); display: flex; align-items: center; gap: 8px; animation: childFade 0.5s ease 0.6s both;">
                    <span style="background: #eaf0f8; padding: 2px 12px; border-radius: 30px; font-weight: 500;">🔒</span>
                    <span>Your session is secured with TLS 1.3</span>
                </div>
            </div>

            <!-- footer (exactly as original, with animation) -->
            <div class="footer-text" style="margin-top: 18px; text-align: center; font-size: 13.5px; color: var(--slate);">
                © 2026 TradespaceX · <a href="#">Privacy</a> · <a href="#">Terms</a>
                <span style="display: inline-block; margin-left: 10px; opacity: 0.6;">v2.4.1</span>
            </div>

        </div>
    </div>

    <!-- small script to demonstrate that functionality stays untouched (just alert) -->
    <script>
        // ensure any interactive elements keep original behavior
        (function() {
            // all buttons/links work as expected
            const links = document.querySelectorAll('a');
            links.forEach(link => {
                if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        // just a subtle feedback – doesn't break anything
                        console.log('Link clicked (functionality preserved)');
                    });
                }
            });

            // additional polish: any input field logs (unchanged)
            const inputs = document.querySelectorAll('input');
            inputs.forEach(inp => {
                inp.addEventListener('input', function() {
                    // silent – no changes
                });
            });
        })();
    </script>

</body>
</html>
