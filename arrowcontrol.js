document.addEventListener('DOMContentLoaded', () => {
	const topBtn = document.querySelector('.arrow-top');
	const bottomBtn = document.querySelector('.arrow-bottom');

	// Helper: returns an array of sections inside <main> that have an id
	function getSections() {
		return Array.from(document.querySelectorAll('main [id]'));
	}

	// Update visibility of top/bottom arrows depending on scroll position
	function updateArrowsVisibility() {
		const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
		const tolerance = 5; // pixels
		const atTop = scrollTop <= tolerance;

		// Determine whether to hide bottom arrow when we reach the contact section
		const sections = getSections();
		let hideBottom = false;
		if (sections.length) {
			const current = getCurrentSectionIndex(sections);
			// Prefer hiding at the explicit #contact section if present
			const contactIndex = sections.findIndex((s) => s.id === 'contact');
			if (contactIndex !== -1) {
				hideBottom = current >= contactIndex;
			} else {
				// fallback: hide at document bottom
				hideBottom = (window.innerHeight + scrollTop) >= (document.documentElement.scrollHeight - tolerance);
			}
		} else {
			// no sections found — fall back to bottom-of-document
			hideBottom = (window.innerHeight + scrollTop) >= (document.documentElement.scrollHeight - tolerance);
		}

		if (topBtn) {
			// hide top arrow visually when at (or near) the very top but preserve layout
			topBtn.style.visibility = atTop ? 'hidden' : 'visible';
			topBtn.style.pointerEvents = atTop ? 'none' : '';
			// accessibility: mark as hidden for assistive tech when applicable
			topBtn.setAttribute('aria-hidden', atTop ? 'true' : 'false');
		}

		if (bottomBtn) {
			// hide bottom arrow visually when we've reached the contact section (or bottom fallback)
			bottomBtn.style.visibility = hideBottom ? 'hidden' : 'visible';
			bottomBtn.style.pointerEvents = hideBottom ? 'none' : '';
			bottomBtn.setAttribute('aria-hidden', hideBottom ? 'true' : 'false');
		}
	}

	// Run on load, and whenever the user scrolls or resizes the window
	updateArrowsVisibility();
	window.addEventListener('scroll', updateArrowsVisibility, { passive: true });
	window.addEventListener('resize', updateArrowsVisibility);

		function getCurrentSectionIndex(sections) {
			const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
			if (!sections.length) return -1;

			// If we're above the first section (e.g. inside the header), return -1
			const tolerance = 5; // pixels
			if (scrollTop + tolerance < sections[0].offsetTop) return -1;

			// Find the last section whose top is <= current scroll position (we are in or past it)
			for (let i = sections.length - 1; i >= 0; i--) {
				if (scrollTop + tolerance >= sections[i].offsetTop) return i;
			}

			// Fallback
			return 0;
		}

	function scrollToIndex(sections, index) {
		if (!sections || sections.length === 0) return;
		if (index < 0) index = 0;
		if (index >= sections.length) index = sections.length - 1;
		const el = sections[index];
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	if (bottomBtn) {
		bottomBtn.addEventListener('click', (e) => {
			e.preventDefault();
			const sections = getSections();
			if (!sections.length) return;
			const current = getCurrentSectionIndex(sections);
			const next = Math.min(current + 1, sections.length - 1);
			if (next !== current) scrollToIndex(sections, next);
		});
	}

	if (topBtn) {
		topBtn.addEventListener('click', (e) => {
			e.preventDefault();
			const sections = getSections();
			if (!sections.length) return;
			const current = getCurrentSectionIndex(sections);
			// If we're above the first section (current === -1) or at the first
			// section (current === 0), treat the click as "go to very top".
			if (current <= 0) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
				return;
			}
			// Otherwise scroll to the previous section
			const prev = current - 1;
			scrollToIndex(sections, prev);
		});
	}
});

