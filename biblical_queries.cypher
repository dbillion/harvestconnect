// ==============================================================================
// BIBLICAL DATABASE - CYPHER QUERIES
// Neo4j Aura Connection: neo4j+s://3e78d93a.databases.neo4j.io
// ==============================================================================
// Instructions: Right-click on any query and select "Execute Query" 
// or press Ctrl+Enter to run against your Neo4j database
// ==============================================================================

// ============================================================================
// 1. MOST MENTIONED PEOPLE (by verse count)
// ============================================================================
MATCH (p:`People.csv`) 
WHERE p.verseCount IS NOT NULL 
RETURN p.name, 
       p.verseCount as mentions, 
       p.gender, 
       p.birthYear, 
       p.deathYear
ORDER BY p.verseCount DESC 
LIMIT 20;


// ============================================================================
// 2. LONGEST LIVING PEOPLE (with valid lifespans)
// ============================================================================
MATCH (p:`People.csv`) 
WHERE p.birthYear IS NOT NULL 
  AND p.deathYear IS NOT NULL
WITH p, (p.deathYear - p.birthYear) as lifespan
WHERE lifespan > 0  // Filter out data errors
RETURN p.name, 
       lifespan as yearsLived,
       p.birthYear,
       p.deathYear,
       p.verseCount
ORDER BY lifespan DESC 
LIMIT 20;


// ============================================================================
// 3. MOST MENTIONED PLACES (Geographic Analysis)
// ============================================================================
MATCH (pl:`Places.csv`) 
WHERE pl.verseCount IS NOT NULL 
RETURN pl.displayTitle as place,
       pl.verseCount as mentions,
       pl.featureType,
       pl.latitude,
       pl.longitude
ORDER BY pl.verseCount DESC 
LIMIT 20;


// ============================================================================
// 4. BOOKS BY VERSE COUNT (Testament Comparison)
// ============================================================================
MATCH (b:`Books.csv`)
RETURN b.bookName,
       b.verseCount,
       b.chapterCount as chapters,
       b.testament,
       b.writers
ORDER BY b.verseCount DESC;


// ============================================================================
// 5. VERSES WITH MULTIPLE PEOPLE & PLACES (Complex Passages)
// ============================================================================
MATCH (v:`Verses.csv`) 
WHERE v.peopleCount IS NOT NULL 
  AND v.placesCount IS NOT NULL
WITH v,
     (COALESCE(v.peopleCount, 0) + COALESCE(v.placesCount, 0)) as complexity
WHERE complexity > 2
RETURN v.book,
       v.chapter,
       v.verseNum,
       v.peopleCount,
       v.placesCount,
       v.verseText
ORDER BY complexity DESC
LIMIT 30;


// ============================================================================
// 6. GENEALOGICAL CONNECTIONS (Father-Son Lines)
// ============================================================================
MATCH (p:`People.csv`) 
WHERE p.father IS NOT NULL 
  AND p.father <> ""
WITH p, 
     p.name as son, 
     p.father as fatherName
MATCH (f:`People.csv` {name: fatherName})
WHERE f IS NOT NULL
RETURN son, 
       fatherName, 
       p.verseCount as sonMentions,
       f.verseCount as fatherMentions,
       (p.verseCount + f.verseCount) as combinedMentions
ORDER BY combinedMentions DESC
LIMIT 30;


// ============================================================================
// 7. PEOPLE BY BIRTH CENTURY (Timeline)
// ============================================================================
MATCH (p:`People.csv`)
WHERE p.birthYear IS NOT NULL
WITH p,
     FLOOR(p.birthYear / 100) * 100 as century
RETURN century as birthCentury,
       COUNT(*) as peopleCount,
       SUM(COALESCE(p.verseCount, 0)) as totalVerses,
       MAX(p.verseCount) as topPersonVerses,
       COLLECT(p.name)[0..5] as examplePeople
GROUP BY century
ORDER BY century DESC;


// ============================================================================
// 8. TESTAMENT COMPARISON (Old vs New)
// ============================================================================
MATCH (b:`Books.csv`)
RETURN b.testament,
       COUNT(*) as bookCount,
       SUM(b.verseCount) as totalVerses,
       SUM(b.chapterCount) as totalChapters,
       ROUND(AVG(b.verseCount), 2) as avgVersesPerBook,
       MAX(b.verseCount) as longestBook,
       MIN(b.verseCount) as shortestBook
GROUP BY b.testament
ORDER BY totalVerses DESC;


// ============================================================================
// 9. GENDER DISTRIBUTION & PROMINENCE
// ============================================================================
MATCH (p:`People.csv`)
WHERE p.gender IS NOT NULL
RETURN p.gender as gender,
       COUNT(*) as count,
       SUM(COALESCE(p.verseCount, 0)) as totalMentions,
       ROUND(AVG(COALESCE(p.verseCount, 0)), 2) as avgMentions,
       MAX(p.verseCount) as mostMentioned
GROUP BY p.gender
ORDER BY totalMentions DESC;


// ============================================================================
// 10. PLACES BY FEATURE TYPE (Geographic Distribution)
// ============================================================================
MATCH (pl:`Places.csv`)
WHERE pl.featureType IS NOT NULL
RETURN pl.featureType as featureType,
       COUNT(*) as placeCount,
       SUM(COALESCE(pl.verseCount, 0)) as totalVerses,
       ROUND(AVG(COALESCE(pl.verseCount, 0)), 2) as avgVersesPerPlace,
       MAX(pl.verseCount) as mostMentioned
GROUP BY pl.featureType
ORDER BY totalVerses DESC;


// ============================================================================
// 11. MOST COMPLEX VERSES (Multiple People Mentioned)
// ============================================================================
MATCH (v:`Verses.csv`)
WHERE v.people IS NOT NULL 
  AND v.peopleCount >= 2
RETURN v.book,
       v.chapter,
       v.verseNum,
       v.peopleCount as mentionedPeople,
       v.people,
       v.verseText
ORDER BY v.peopleCount DESC
LIMIT 25;


// ============================================================================
// 12. BOOKS WITH MOST PEOPLE & PLACES
// ============================================================================
MATCH (b:`Books.csv`)
WHERE b.peopleCount IS NOT NULL
  AND b.placeCount IS NOT NULL
RETURN b.bookName,
       b.verseCount,
       b.peopleCount as uniquePeople,
       b.placeCount as uniquePlaces,
       b.chapterCount as chapters,
       (COALESCE(b.peopleCount, 0) + COALESCE(b.placeCount, 0)) as totalReferences
ORDER BY totalReferences DESC
LIMIT 25;


// ============================================================================
// 13. PROPHETIC BOOKS ANALYSIS
// ============================================================================
MATCH (b:`Books.csv`)
WHERE b.bookName IN ['Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 
                     'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 
                     'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 
                     'Haggai', 'Zechariah', 'Malachi']
RETURN b.bookName,
       b.verseCount,
       b.chapterCount,
       b.writers
ORDER BY b.verseCount DESC;


// ============================================================================
// 14. DATA QUALITY CHECK - Invalid Lifespans
// ============================================================================
MATCH (p:`People.csv`)
WHERE p.birthYear IS NOT NULL 
  AND p.deathYear IS NOT NULL
WITH p, (p.deathYear - p.birthYear) as lifespan
WHERE lifespan <= 0
RETURN p.name,
       p.birthYear,
       p.deathYear,
       lifespan as invalidLifespan,
       p.verseCount
ORDER BY lifespan ASC;


// ============================================================================
// 15. DATA QUALITY CHECK - Missing Critical Fields
// ============================================================================
MATCH (p:`People.csv`)
WITH p,
     CASE WHEN p.birthYear IS NULL THEN 1 ELSE 0 END +
     CASE WHEN p.deathYear IS NULL THEN 1 ELSE 0 END +
     CASE WHEN p.birthPlace IS NULL THEN 1 ELSE 0 END +
     CASE WHEN p.deathPlace IS NULL THEN 1 ELSE 0 END as missingFieldCount
WHERE missingFieldCount >= 2 AND p.verseCount > 50
RETURN p.name,
       p.verseCount,
       missingFieldCount as missingFields
ORDER BY p.verseCount DESC
LIMIT 30;


// ============================================================================
// 16. PEOPLE WITH CHILDREN INFORMATION
// ============================================================================
MATCH (p:`People.csv`)
WHERE p.children IS NOT NULL 
  AND p.children <> ""
WITH p, 
     SIZE(SPLIT(COALESCE(p.children, ''), ',')) as childCount
WHERE childCount > 0
RETURN p.name, 
       childCount as numberOfChildren,
       p.children,
       p.verseCount
ORDER BY childCount DESC 
LIMIT 20;


// ============================================================================
// 17. PEOPLE GROUPS ANALYSIS
// ============================================================================
MATCH (pg:`PeopleGroups.csv`)
RETURN pg.groupName,
       pg.events,
       pg.verses,
       pg.members
ORDER BY pg.groupName;


// ============================================================================
// 18. CHAPTERS WITH MOST REFERENCES
// ============================================================================
MATCH (c:`Chapters.csv`)
WHERE c.peopleCount IS NOT NULL 
  AND c.placesCount IS NOT NULL
RETURN c.book,
       c.chapterNum,
       c.peopleCount as uniquePeople,
       c.placesCount as uniquePlaces,
       (COALESCE(c.peopleCount, 0) + COALESCE(c.placesCount, 0)) as totalReferences,
       c.verses
ORDER BY totalReferences DESC
LIMIT 30;


// ============================================================================
// 19. DICTIONARY ENTRIES (watson's BIBLE DICTIONARY)
// ============================================================================
MATCH (e:`eaton.csv`)
WHERE e.termLabel IS NOT NULL
RETURN e.termLabel,
       e.termID,
       e.matchType,
       e.dictText
ORDER BY e.termLabel
LIMIT 50;


// ============================================================================
// 20. WORD FREQUENCY ANALYSIS
// ============================================================================
MATCH (w:`WordIndex.csv`)
WHERE w.Word IS NOT NULL
RETURN w.Word as word,
       COUNT(*) as frequency,
       COUNT(DISTINCT w.BookID) as booksAppearingIn
ORDER BY frequency DESC
LIMIT 100;
