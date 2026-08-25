# Codex Handoff - Berlin Places Release

Last updated: 2026-08-25

## Outcome

The Berlin Places guide has been expanded to 16 recommendations and reorganised around Richard's actual brief: cool, well-regarded wine bars, bistros, small plates and relaxed rooms, with different price points and straightforward access from Mitte.

The production deployment is the remaining release step at the time of this draft. Final commit, Railway and live-route evidence will be appended after deployment.

## What Changed

Ten relaxed venues now lead the Berlin guide:

- Trio - modern German Wirtshaus
- Pluto - biodynamic wine and small plates
- Ottorink Weinbar - Mosel-focused neighbourhood bar
- ORA - seasonal sharing plates in a former pharmacy
- Jaja - natural-wine bistro
- La Buvette - French bar a vin and bistro
- Briefmarken Weine / Il Brief - Italian natural wine in a former stamp shop
- Der Weinlobbyist - German and Austrian wine, Flammkuchen and courtyard
- Barra - seasonal small plates and low-intervention wine
- Standard Serious Pizza - Neapolitan pizza and low-intervention wine

The six earlier Berlin recommendations remain available after that shortlist:

- Muret la Barba
- Freundschaft
- Restaurant Chateau Royal
- Bandol sur mer
- Cookies Cream
- Rutz

## Editorial Decisions

- Berlin is included in the Europe town filter.
- Relaxed choices appear before Michelin and destination-dining entries.
- The guide extends beyond the administrative Mitte boundary only where a venue is distinctive and well connected.
- Jaja and Ottorink are intentionally text-led because reliable browser-safe official room images were not available.
- All venue copy is editorial research, not a claim that Amanda or Richard has personally visited.

## Code and Test Scope

- `src/data/places.js`
  - adds 16 Berlin entries in total across this release tranche
  - adds Berlin to `TOWN_GROUPS`
- `src/__tests__/venueWineLists.invariants.test.js`
  - ensures every venue ID is unique
  - ensures every venue wine recommendation references a real wine ID

No cellar, sync, authentication, database or server code was changed.

## Verified Local State

- Tests: `124/124` passed
- Production build: passed
- Diff whitespace check: passed
- Desktop Places QA: passed at 1280px
- Mobile Places QA: passed at 390 x 844
- Berlin result count: 16
- New relaxed Berlin cards present: 10
- Failed images: 0
- Horizontal overflow: none
- Browser console errors: 0

## Release Evidence - Pending

Complete after deployment:

- application commit
- documentation commit, if separate
- Railway deployment ID
- Railway deployment status
- production `/healthz`
- live Berlin Places verification

## Workspace Boundary

Only the Berlin Places tranche and current project documentation belong in this release. Existing untracked images, CSVs, sourcing packs, scripts and `output/` material are unrelated local work and must not be staged implicitly.

## Recommended Next Work

1. Add `region` and `town` URL parameters to Places for a direct Berlin-filtered link.
2. Capture stable public wine lists for the most wine-focused Berlin venues.
3. Re-verify hours and booking policies shortly before travel.
4. Treat shared-bundle performance work as a separate change.
