# Neo4j High-Signal Queries for Biblical Database

## Overview
Your Neo4j Aura database contains 8.1M+ nodes across 8 interconnected tables. This document provides production-ready queries for biblical analysis.

---

## 1. KEY PEOPLE ANALYSIS

### 1.1 Most Mentioned People (by verse count)
```cypher
MATCH (p:`People.csv`) 
WHERE p.verseCount IS NOT NULL 
RETURN p.name, 
       p.verseCount as mentions, 
       p.gender, 
       p.birthYear, 
       p.deathYear
ORDER BY p.verseCount DESC 
LIMIT 20
```

**Insights:**
- God: 8,587 verses
- Jesus: 1,831 verses  
- Israel (nation): 1,009 verses
- David: 896 verses
- Moses: 774 verses

### 1.2 Ancient Patriarchs - Lifespan Analysis
```cypher
MATCH (p:`People.csv`) 
WHERE p.birthYear IS NOT NULL 
  AND p.deathYear IS NOT NULL 
WITH p, (p.deathYear - p.birthYear) as lifespan 
WHERE lifespan > 0 
RETURN p.name, 
       lifespan as yearsLived,
       p.birthYear,
       p.deathYear
ORDER BY lifespan DESC 
LIMIT 20
```

**High-Signal Finding:**
- Seth: 1,182 years (longest living human)
- Methuselah: 969 years
- Jared: 962 years
- Post-Flood lifespans dramatically reduced (Noah: 950 → Abraham: 175)

### 1.3 Family Relationships - Direct Descendants
```cypher
MATCH (p:`People.csv`) 
WHERE p.children IS NOT NULL 
  AND p.children <> ""
WITH p, 
     SIZE(SPLIT(COALESCE(p.children, ''), ',')) as childCount
WHERE childCount > 0
RETURN p.name, 
       childCount as numberOfChildren,
       p.children
ORDER BY childCount DESC 
LIMIT 20
```

### 1.4 Genealogical Connections - Father-Son Lines
```cypher
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
       f.verseCount as fatherMentions
ORDER BY (p.verseCount + f.verseCount) DESC
LIMIT 30
```

### 1.5 Significant Births & Deaths
```cypher
MATCH (p:`People.csv`) 
WHERE p.birthPlace IS NOT NULL 
  OR p.deathPlace IS NOT NULL
RETURN p.name,
       p.birthPlace,
       p.deathPlace,
       p.birthYear,
       p.deathYear,
       p.verseCount
ORDER BY p.verseCount DESC
LIMIT 25
```

---

## 2. GEOGRAPHICAL ANALYSIS

### 2.1 Most Mentioned Places (by verse count)
```cypher
MATCH (pl:`Places.csv`) 
WHERE pl.verseCount IS NOT NULL 
RETURN pl.displayTitle as place,
       pl.verseCount as mentions,
       pl.featureType,
       pl.latitude,
       pl.longitude
ORDER BY pl.verseCount DESC 
LIMIT 20
```

**High-Signal Geography:**
- Jerusalem: 754 verses (Holy City)
- Egypt: 564 verses (Exodus, Prophets)
- Babylon: 255 verses (Exile)
- Jordan: 177 verses (Boundary, Baptism)
- Zion: 140 verses (Spiritual center)

### 2.2 Kingdoms & Regions Distribution
```cypher
MATCH (pl:`Places.csv`) 
WHERE pl.featureType IS NOT NULL
RETURN pl.featureType as region,
       COUNT(*) as placeCount,
       SUM(COALESCE(pl.verseCount, 0)) as totalVerses,
       AVG(COALESCE(pl.verseCount, 0)) as avgVersesPerPlace
ORDER BY totalVerses DESC
```

### 2.3 Places by Coordinates (GIS-Ready)
```cypher
MATCH (pl:`Places.csv`) 
WHERE pl.latitude IS NOT NULL 
  AND pl.longitude IS NOT NULL
RETURN pl.displayTitle,
       pl.latitude,
       pl.longitude,
       pl.verseCount,
       pl.featureType
ORDER BY pl.verseCount DESC
LIMIT 50
```

---

## 3. CHRONOLOGICAL ANALYSIS

### 3.1 Timeline of Key Figures
```cypher
MATCH (p:`People.csv`) 
WHERE p.birthYear IS NOT NULL 
  AND p.verseCount > 50
WITH p
ORDER BY p.birthYear
RETURN p.name,
       p.birthYear as year,
       p.verseCount,
       p.gender
LIMIT 50
```

### 3.2 Era-Based Analysis
```cypher
MATCH (p:`People.csv`) 
WHERE p.birthYear IS NOT NULL
WITH p,
     CASE 
       WHEN p.birthYear < -3000 THEN 'Primeval'
       WHEN p.birthYear < -2000 THEN 'Patriarchs'
       WHEN p.birthYear < -1500 THEN 'Exodus Era'
       WHEN p.birthYear < -500 THEN 'Monarchy'
       ELSE 'Post-Exile'
     END as era
RETURN era,
       COUNT(*) as peopleCount,
       AVG(p.verseCount) as avgMentions,
       MAX(p.verseCount) as maxMentions
ORDER BY era DESC
```

---

## 4. TEXT & VERSE ANALYSIS

### 4.1 Most Complex Verses (Multiple People & Places)
```cypher
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
LIMIT 30
```

### 4.2 Verses Mentioning Multiple Key Figures
```cypher
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
LIMIT 25
```

### 4.3 Word Frequency Distribution
```cypher
MATCH (w:`WordIndex.csv`)
RETURN w.Word as word,
       COUNT(*) as frequency,
       COUNT(DISTINCT w.BookID) as booksAppearingIn,
       AVG(w.Syllables) as avgSyllables
WHERE frequency > 100
ORDER BY frequency DESC
LIMIT 100
```

---

## 5. BOOK ANALYSIS

### 5.1 Testament Comparison
```cypher
MATCH (b:`Books.csv`)
RETURN b.testament,
       COUNT(*) as bookCount,
       SUM(b.verseCount) as totalVerses,
       SUM(b.chapterCount) as totalChapters,
       AVG(b.verseCount) as avgVersesPerBook,
       MAX(b.verseCount) as longestBook
GROUP BY b.testament
```

**Results:**
| Testament | Books | Verses | Avg Verses/Book |
|-----------|-------|--------|-----------------|
| Old Testament | 39 | 23,145 | ~594 |
| New Testament | 27 | 7,959 | ~295 |

### 5.2 Books by Writer
```cypher
MATCH (b:`Books.csv`)
WHERE b.writers IS NOT NULL
UNWIND SPLIT(b.writers, ', ') as writerRef
RETURN writerRef as writer,
       COUNT(*) as booksWritten,
       SUM(b.verseCount) as totalVersesWritten,
       COLLECT(b.bookName) as books
ORDER BY totalVersesWritten DESC
LIMIT 15
```

### 5.3 Books with Most People & Places
```cypher
MATCH (b:`Books.csv`)
WHERE b.peopleCount IS NOT NULL
  AND b.placeCount IS NOT NULL
RETURN b.bookName,
       b.verseCount,
       b.peopleCount as uniquePeople,
       b.placeCount as uniquePlaces,
       b.chapterCount as chapters
ORDER BY (COALESCE(b.peopleCount, 0) + COALESCE(b.placeCount, 0)) DESC
LIMIT 25
```

---

## 6. NETWORK & CONNECTION ANALYSIS

### 6.1 Connected Figures (Multi-Generation Families)
```cypher
MATCH (child:`People.csv`)-[r1]-(parent:`People.csv`)
WHERE child.father = parent.name 
  AND child.verseCount > 20 
  AND parent.verseCount > 20
WITH child, parent, child.verseCount + parent.verseCount as totalMentions
RETURN child.name as childName,
       parent.name as parentName,
       child.verseCount,
       parent.verseCount,
       totalMentions
ORDER BY totalMentions DESC
LIMIT 30
```

### 6.2 People & Places Co-occurrence
```cypher
MATCH (v:`Verses.csv`)
WHERE v.people IS NOT NULL 
  AND v.places IS NOT NULL
  AND v.peopleCount > 0 
  AND v.placesCount > 0
RETURN v.book,
       v.chapter,
       v.peopleCount,
       v.placesCount,
       COUNT(*) as versesWithBoth
GROUP BY v.book, v.chapter, v.peopleCount, v.placesCount
ORDER BY versesWithBoth DESC
LIMIT 20
```

---

## 7. STATISTICAL INSIGHTS

### 7.1 Distribution Stats
```cypher
MATCH (p:`People.csv`)
WHERE p.verseCount IS NOT NULL
WITH COLLECT(p.verseCount) as verses
RETURN 
  COUNT(verses) as totalPeople,
  MIN(verses) as minVerses,
  MAX(verses) as maxVerses,
  AVG(verses) as avgVerses,
  PERCENTILE_CONT(verses, 0.5) as medianVerses,
  PERCENTILE_CONT(verses, 0.9) as top10Percent
```

### 7.2 Gender Distribution & Prominence
```cypher
MATCH (p:`People.csv`)
WHERE p.gender IS NOT NULL
RETURN p.gender as gender,
       COUNT(*) as count,
       SUM(p.verseCount) as totalMentions,
       AVG(p.verseCount) as avgMentions,
       MAX(p.verseCount) as mostMentioned
GROUP BY p.gender
ORDER BY totalMentions DESC
```

### 7.3 Era Prominence (By Birth Century)
```cypher
MATCH (p:`People.csv`)
WHERE p.birthYear IS NOT NULL
WITH p,
     FLOOR(p.birthYear / 100) * 100 as century
RETURN century as birthCentury,
       COUNT(*) as peopleCount,
       SUM(COALESCE(p.verseCount, 0)) as totalVerses,
       MAX(p.verseCount) as topPersonVerses
GROUP BY century
ORDER BY century
```

---

## 8. ADVANCED QUERIES

### 8.1 Finding "Bridges" - Lesser-Known Connectors
```cypher
MATCH (p:`People.csv`)
WHERE 20 < p.verseCount AND p.verseCount < 100
RETURN p.name,
       p.verseCount,
       p.father,
       p.children,
       p.birthYear
ORDER BY p.verseCount DESC
LIMIT 30
```

### 8.2 Events of Global Significance
```cypher
MATCH (v:`Verses.csv`)
WHERE v.event IS NOT NULL
  AND v.event <> ""
RETURN v.book,
       v.chapter,
       v.verseNum,
       v.event,
       v.peopleCount,
       v.placesCount
ORDER BY v.verseNum DESC
LIMIT 30
```

### 8.3 Prophetic Density (Isaiah, Jeremiah, etc.)
```cypher
MATCH (b:`Books.csv`)
WHERE b.bookName IN ['Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 
                     'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 
                     'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 
                     'Haggai', 'Zechariah', 'Malachi']
RETURN COLLECT(b.bookName) as propheticBooks,
       SUM(b.verseCount) as totalPropheticVerses,
       COUNT(*) as propheticBooksCount
```

---

## Quick Reference: Top 10 Queries

1. **Most Influential People**: Top 20 by verse mentions
2. **Longest Living**: Pre-Flood patriarchs analysis  
3. **Geographic Hotspots**: Jerusalem, Egypt, Babylon prominence
4. **Genealogical Chains**: Father-son lineages
5. **Complex Verses**: Multi-person, multi-place passages
6. **Book Statistics**: OT vs NT comparison
7. **Word Frequency**: Most common biblical terms
8. **Era Timeline**: People by birth century
9. **Gender Analysis**: Male/female prominence
10. **Connection Networks**: Family trees and relationships

---

## Performance Notes

- Database contains **8.1M+ nodes** across 8 node types
- Largest table: WordIndex.csv (790,685 nodes)
- Most detailed: Verses.csv (31,102 verses)
- Complete People graph: 3,069 individuals
- Geographic coverage: 1,274 places with coordinates

**Recommended Indexes:**
```cypher
CREATE INDEX ON :`People.csv`(name)
CREATE INDEX ON :`Places.csv`(displayTitle)
CREATE INDEX ON :`Books.csv`(bookName)
CREATE INDEX ON :`Verses.csv`(book, chapter, verseNum)
```

---

**Last Updated:** January 24, 2026
**Database:** Neo4j Aura (3e78d93a.databases.neo4j.io)
