// Compatibility command for historical mobile-orbit QA.
// Product decision: preserve 3D continuous orbit on desktop, while small phones
// show exactly one screen to avoid the overlapping dashboards reported on iOS.
// The current phone regression is maintained in mobile-showcase.cjs.
require('./mobile-showcase.cjs');
