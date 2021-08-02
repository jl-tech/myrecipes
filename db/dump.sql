-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: localhost    Database: myrecipes
-- ------------------------------------------------------
-- Server version	8.0.25-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `comment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `recipe_id` int DEFAULT NULL,
  `by_user_id` int DEFAULT NULL,
  `time_created` timestamp NULL DEFAULT NULL,
  `comment_text` text,
  PRIMARY KEY (`comment_id`),
  UNIQUE KEY `comment_id` (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (7,1,2,'2021-07-22 16:28:39','yes!'),(8,4,2,'2021-07-22 16:32:33','Delicious and easy!'),(9,13,2,'2021-07-22 21:05:00','yea'),(13,3,2,'2021-07-22 22:56:27','I\'ll upload images soon!'),(15,1,6,'2021-07-22 23:11:31','Great recipe, thanks Jonathan!!'),(16,8,6,'2021-07-23 02:39:08','A bit too garlicky for me!'),(17,16,6,'2021-07-24 02:27:59','Any thoughts?'),(20,13,6,'2021-07-24 02:34:35','Any photos???'),(21,16,3,'2021-07-24 03:19:10','Giving it a go now!'),(22,16,3,'2021-07-24 03:19:18','Looks tasty!'),(23,12,3,'2021-07-24 03:31:01','DEEELICIOUS!'),(24,1,3,'2021-07-24 03:33:10','Love Italian food!'),(25,16,4,'2021-07-24 03:42:14','it is tasty!!'),(26,16,4,'2021-07-24 04:02:40','Can\'t recommend this enough!'),(28,16,4,'2021-07-24 04:07:51','VERY easy to cook btw'),(29,1,2,'2021-07-24 16:29:33','Thanks for the feedback!'),(31,1,2,'2021-07-24 16:42:37','Glad you enjoyed it!'),(32,1,2,'2021-07-24 16:42:53','How\'s the oil. Too much or too little?'),(33,1,4,'2021-07-29 02:56:21','The amount seems fine to me!!'),(34,1,4,'2021-07-29 02:57:42','I loved the recipe too <3'),(35,2,4,'2021-07-29 03:00:42','DELICIOUS!!!'),(37,9,4,'2021-07-29 03:15:31','Any thoughts?'),(38,13,2,'2021-07-29 18:52:53','I\'ll add some if i make it again sorry');
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Likes`
--

DROP TABLE IF EXISTS `Likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Likes` (
  `recipe_id` int NOT NULL,
  `liked_by_user_id` int NOT NULL,
  PRIMARY KEY (`recipe_id`,`liked_by_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Likes`
--

LOCK TABLES `Likes` WRITE;
/*!40000 ALTER TABLE `Likes` DISABLE KEYS */;
INSERT INTO `Likes` VALUES (1,2),(1,4),(1,6),(2,4),(3,2),(4,2),(4,3),(9,2),(10,3),(12,2),(13,2),(16,4);
/*!40000 ALTER TABLE `Likes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `increase_likes` BEFORE INSERT ON `Likes` FOR EACH ROW update Recipes set likes = likes + 1 where recipe_id=new.recipe_id */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `decrease_likes` BEFORE DELETE ON `Likes` FOR EACH ROW update Recipes set likes = likes - 1 where recipe_id=old.recipe_id */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `RecipeIngredients`
--

DROP TABLE IF EXISTS `RecipeIngredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RecipeIngredients` (
  `recipe_id` int NOT NULL,
  `ingredient_no` int NOT NULL,
  `ingredient_name` text,
  `quantity` float DEFAULT NULL,
  `unit` text,
  PRIMARY KEY (`recipe_id`,`ingredient_no`),
  FULLTEXT KEY `ingredient_name` (`ingredient_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RecipeIngredients`
--

LOCK TABLES `RecipeIngredients` WRITE;
/*!40000 ALTER TABLE `RecipeIngredients` DISABLE KEYS */;
INSERT INTO `RecipeIngredients` VALUES (1,0,'olive oil',1,'tbsp'),(1,1,'smoked streaky bacon, finely chopped',4,'rashers'),(1,2,'medium onions, finely chopped',2,NULL),(1,3,'carrots, trimmed and finely chopped',2,NULL),(1,4,' celery sticks, finely chopped',2,NULL),(1,5,'garlic cloves finely chopped',2,NULL),(1,6,'rosemary leaves picked and finely chopped',3,'sprigs '),(1,7,'beef mince',500,'g'),(1,8,'plum tomatoes',800,'g'),(1,9,'basil leaves picked, ¾ finely chopped and the rest left whole for garnish',NULL,'small pack'),(1,10,'dried oregano',1,'tsp'),(1,11,'fresh bay leaves',2,NULL),(1,12,'tomato puree',2,'tbsp'),(1,13,'beef stock cube',1,NULL),(1,14,'red chilli deseeded and finely chopped',1,NULL),(1,15,'red wine',125,'ml'),(1,16,'cherry tomatoes sliced in half',6,NULL),(1,17,'parmesan grated',75,'g'),(1,18,'spaghetti',400,'g'),(2,0,'ground lean (7% fat) beef',1,'pound'),(2,1,'large egg',1,NULL),(2,2,'minced onion',0.5,'cup'),(2,3,'fine dried bread crumbs',0.25,'cup'),(2,4,'Worcestershire',1,'tablespoon'),(2,5,'cloves garlic',2,NULL),(2,6,'salt',0.5,'teaspoon'),(2,7,'pepper',0.25,'teaspoon'),(2,8,'hamburger buns, split',4,NULL),(2,9,'mayonnaise',0.25,'cup'),(2,10,'ketchup',0.25,'cup'),(2,11,'iceberge lettuce leaves',4,NULL),(2,12,'firm-ripe tomato, thinly sliced',1,NULL),(2,13,'thin slices red onion',4,NULL),(3,0,'pork',0.5,'lb'),(3,1,'salt',1,'teaspoon'),(3,2,'corn flour',1,'teaspoon'),(3,3,'egg',1,NULL),(3,4,'corn flour',1,'cup'),(3,5,'oil',2.5,'cups'),(3,6,'oil',2,'tablespoons'),(3,7,'garlic, crushed',2,'teaspoons'),(3,8,'green bell pepper, chopped',0.5,NULL),(3,9,'pineapple',1,'cup'),(3,10,'white caster sugar',0.25,'cup'),(3,11,'rice vinegar',0.25,'cup'),(3,12,'ketchup',2,'tabespoons'),(4,0,'large eggs',8,NULL),(4,1,'Dijon mustard',1,'tsp'),(4,2,'Koscher salt and pepper',NULL,NULL),(4,3,'olive oil',1,'tbsp'),(4,4,'thick cut bacon, broken into pieces',2,'slices'),(4,5,'spinach, torn',2,'c'),(4,6,'Gruyère cheese, shredded',2,'0z'),(5,0,'milk',0.25,'cup'),(5,1,'plain yogurt',0.5,'cup'),(5,2,'fresh summer fruit',2,'cup'),(6,0,'butter, softened',4,'tbsp'),(6,1,'garlic',2,'cloves'),(6,2,'freshly chopped parsley',2,'tsp'),(6,3,'freshly chopped chives',1,'tsp'),(6,4,'freshly chopped thyme',1,'tsp'),(6,5,'fresly chopped rosemary',1,'tsp'),(6,6,'bone-in ribeye',1,NULL),(6,7,'koscher salt',NULL,NULL),(6,8,'freshly ground black pepper',NULL,NULL),(7,0,'pizza dough',0.5,NULL),(7,1,'mozerella cheese',1.5,'cup'),(7,2,'olive oil',NULL,NULL),(7,3,'fresh basil leaves',1,'bunch'),(7,4,'salt',0.5,'teaspoon'),(7,5,'tomato sauce',1,'cup'),(8,0,'peanut oil',80,'ml'),(8,1,'garlic cloves, thinly sliced',4,NULL),(8,2,'minced pork',300,'g'),(8,3,'chilli bean sauce',0.25,'cup'),(8,4,'garlic chives, chopped',1,'bunch'),(8,5,'cooked jasmine rice',4,'cups'),(8,6,'fried eggs',NULL,NULL),(9,0,'waxy baby potatoes',700,'g'),(9,1,'capers, rinsed',1,'tbsp'),(9,2,'fresh flatleaf parsley leaves',NULL,'handful'),(9,3,'garlic clove',1,'small'),(9,4,'finely grated zest lemon',1,NULL),(9,5,'extra-virgin olive oil',3,'tbsp'),(10,0,'active dry yeast',0.25,'ounce'),(10,1,'warm water',2,'cups'),(10,2,'vegetable oil',3,'tablespoons'),(10,3,'salt',1,'teaspoon'),(10,4,'all-purpose flour',5,'cups'),(10,5,'tomato sauce',2,'cans'),(10,6,'grated onion',1,'teaspoon'),(10,7,'druied oregano',1,'teaspoon'),(10,8,'salt',0.25,'teaspoon'),(10,9,'pepper',0.125,'teaspoon'),(10,10,'mozerella cheese',1.5,'cup'),(12,0,'sunflower oil',3,'tbsp'),(12,1,'braising steak, diced',1,'kg'),(12,2,'onions, roughly chopped',2,NULL),(12,3,'plain flour',3,'tbsp'),(12,4,'tomato ketchup',1,'tbsp'),(12,5,'beef stock cubes mixed with boiling water',2,NULL),(12,6,'puff pastry',375,'grams'),(12,7,'egg yolk, beaten',1,NULL),(13,0,'flour',2.5,'cups'),(13,1,'salt',1,'teaspoon'),(13,2,'butter, cold, cubed',1.5,'sticks'),(13,3,'ice water',8,'tablespoons'),(13,4,'granny smith apple, cored, sliced, peeled',2.5,'lb'),(13,5,'sugar',0.75,'cup'),(13,6,'flour',2,'tablespoons'),(13,7,'salt',0.5,'teaspoon'),(13,8,'cinnamon',1,'teaspoon'),(13,9,'nutmeg',0.25,'teaspoon'),(13,10,'lemon',0.5,NULL),(13,11,'beaten',1,'egg'),(13,12,'sugar',1,'tablespoon'),(13,13,'vanilla ice cream',1,'scoop'),(14,0,'puff pastry',22,'ounce'),(14,1,'chicken breasts, cut into small chunks',3,NULL),(14,2,'carrots',3,NULL),(14,3,'medium sized potatoes',3,NULL),(14,4,'of salt and pepper',NULL,'pinch'),(14,5,'of thyme',2,'sprigs'),(14,6,'chicken stock',2.5,'cups'),(14,7,'butter',3.5,'tbsp'),(14,8,'large onion, peeled and finely chopped',1,NULL),(14,9,'plain flour',6,'tbsp'),(14,10,'milk',1.25,'cups'),(14,11,'lemon juice',1,NULL),(14,12,'egg, slightly whisked with a fork',1,NULL),(16,0,'low salt beef stock',1,'L'),(16,1,'large onion',1,NULL),(16,2,'large thumb-sized piece ginger, peeled',NULL,NULL),(16,3,'cinnamon stick',1,NULL),(16,4,'star anise',2,NULL),(16,5,'coriander seeds',1,'tsp'),(16,6,'cloves',0.5,'tsp'),(16,7,'sirloin steak',230,'g'),(16,8,'palm sugar',1,'tsp'),(16,9,'fish sauce',1,'tbsp'),(16,10,'soy sauce',1.5,'tbsp'),(16,11,'flat rice noodles',200,'g'),(16,12,'spring onions, shredded',2,NULL),(16,13,'small red (bird\'s eye) chlli, finely sliced',1,NULL),(16,14,'Thai basil and coriander',2,'handfuls'),(16,15,'cut into wedges',1,'lime');
/*!40000 ALTER TABLE `RecipeIngredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RecipePhotos`
--

DROP TABLE IF EXISTS `RecipePhotos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RecipePhotos` (
  `recipe_id` int NOT NULL,
  `photo_no` int NOT NULL,
  `photo_path` text,
  `photo_name` text,
  PRIMARY KEY (`recipe_id`,`photo_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RecipePhotos`
--

LOCK TABLES `RecipePhotos` WRITE;
/*!40000 ALTER TABLE `RecipePhotos` DISABLE KEYS */;
INSERT INTO `RecipePhotos` VALUES (1,0,'b525380467d61d8abb6f390b477c5ba8b1340a80.jpg','bolonez_soslu_makarna3.jpg'),(1,1,'d0ef551300a08aa4d8b3a787404bacd18af6536a.jpg','easy-spaghetti-bolognese-recipe-main-photo.jpg'),(1,2,'6f456946e6110f2ccb9368b5afb1c016ef81327c.jpg','Spaghetti-Bolognese-square-FS-0204.jpg'),(2,0,'dd9ae7230d1cbf3c2150ea699bee875f0d08bd12.jpg','image.jpg'),(4,0,'b6a6791be03c0ad7dc0fd9baaa984709d8f6b100.jpg','gruyere-bacon-and-spinach-scrambled-eggs-1608648723.jpg'),(5,0,'b6e83a8a654b8a98e3eecdb9ae4cbe7d289f11c3.jpg','how-to-make-a-smoothie-1601565091.jpg'),(6,0,'8658d54671c971b8252238917c57263d1ee00712.jpg','delish-190807-air-fryer-steak-0084-landscape-pf-1566237752.jpg'),(7,0,'2c370377cb7b76b1cd2be7f94a9835478a316199.jpg','pizza_1.jpeg'),(7,1,'4102a1b211e3e3ecd4c811accab64d6a4f42e63d.jpg','pizza_2.jpeg'),(7,2,'712ccd2c8d86b8e90912e5a06008c7f9c45abf94.jpg','pizza_3.jpeg'),(7,3,'7cebc2dc7b8ec712478f9f4f578ff71122bd9fb0.jpg','pizza_4.jpeg'),(8,0,'fc9af8996f1cd89d97d09ba9a1be949bdd6d9479.jpg','garlicky-fried-rice-with-crisp-pork-127604-1.jpg'),(9,0,'52c005b26556815f00c50e888a95575512c108fa.jpg','AUTUMN-best-fried-potatoes-768.jpg'),(10,0,'e3b477eae224caa9efe942326394a83389c9bc44.jpg','Pizzasupremehoriz-1ccfa0b1732b4c128427d19ae02a422b.jpg'),(10,1,'24f4f86cc3edc3460f3726e28cbcb570eb9c542f.jpg','sl_supremepizza_00072-2000.jpg'),(12,0,'8342cd51b8a7baceec2ca64ee3b6f59cefb27275.jpg','easy-steak-pie-89f7027.jpg'),(14,0,'e4f648c3e8b0be9258976e431788abbd30c55779.png','Creamy-Chicken-Pie-tall3.webp'),(16,0,'3f04c8301d2b26d0f62658ecc6ec38ab75350e49.jpg','index.jpg'),(16,1,'bd3cc514699a9c562cc111e1ab943c2bd8af8a6c.png','beef-pho-cbd3623.webp');
/*!40000 ALTER TABLE `RecipePhotos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RecipeSteps`
--

DROP TABLE IF EXISTS `RecipeSteps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RecipeSteps` (
  `recipe_id` int NOT NULL,
  `step_no` int NOT NULL,
  `step_text` text,
  `step_photo_path` text,
  PRIMARY KEY (`recipe_id`,`step_no`),
  FULLTEXT KEY `step_text` (`step_text`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RecipeSteps`
--

LOCK TABLES `RecipeSteps` WRITE;
/*!40000 ALTER TABLE `RecipeSteps` DISABLE KEYS */;
INSERT INTO `RecipeSteps` VALUES (1,0,'(Source BBC Good Food) Put a large saucepan on a medium heat and add 1 tbsp olive oil.',NULL),(1,1,'Add 4 finely chopped bacon rashers and fry for 10 mins until golden and crisp.',NULL),(1,2,'Reduce the heat and add the 2 onions, 2 carrots, 2 celery sticks, 2 garlic cloves and the leaves from 2-3 sprigs rosemary, all finely chopped, then fry for 10 mins. Stir the veg often until it softens.',NULL),(1,3,'Increase the heat to medium-high, add 500g beef mince and cook stirring for 3-4 mins until the meat is browned all over.',NULL),(1,4,'Add 2 tins plum tomatoes, the finely chopped leaves from ¾ small pack basil, 1 tsp dried oregano, 2 bay leaves, 2 tbsp tomato purée, 1 beef stock cube, 1 deseeded and finely chopped red chilli (if using), 125ml red wine and 6 halved cherry tomatoes. Stir with a wooden spoon, breaking up the plum tomatoes.',NULL),(1,5,'Bring to the boil, reduce to a gentle simmer and cover with a lid. Cook for 1 hr 15 mins stirring occasionally, until you have a rich, thick sauce.',NULL),(1,6,'Add the 75g grated parmesan, check the seasoning and stir.',NULL),(1,7,'When the bolognese is nearly finished, cook 400g spaghetti following the pack instructions.',NULL),(1,8,'Drain the spaghetti and either stir into the bolognese sauce, or serve the sauce on top. Serve with more grated parmesan, the remaining basil leaves and crusty bread, if you like.',NULL),(2,0,'(Source: myrecipes.com) In a bowl, mix ground beef, egg, onion, bread crumbs, Worcestershire, garlic, 1/2 teaspoon salt, and 1/4 teaspoon pepper until well blended. Divide mixture into four equal portions and shape each into a patty about 4 inches wide.',NULL),(2,1,'Lay burgers on an oiled barbecue grill over a solid bed of hot coals or high heat on a gas grill (you can hold your hand at grill level only 2 to 3 seconds); close lid on gas grill. Cook burgers, turning once, until browned on both sides and no longer pink inside (cut to test), 7 to 8 minutes total. Remove from grill.',NULL),(2,2,'Lay buns, cut side down, on grill and cook until lightly toasted, 30 seconds to 1 minute.',NULL),(2,3,'Spread mayonnaise and ketchup on bun bottoms. Add lettuce, tomato, burger, onion, and salt and pepper to taste. Set bun tops in place.',NULL),(3,0,'(Source: tasty.co) In a bowl, combine all marinade ingredients with the pork. Cover and leave to marinade in the fridge 20 minutes.',NULL),(3,1,'Place the corn flour in a large bowl and toss the marinated pork chunks until liberally coated.',NULL),(3,2,'In a medium-sized saucepan, heat the oil to 350˚F (180°C).',NULL),(3,3,'Deep fry the pork pieces for about 3-4 minutes until the coating is golden brown and the pork is cooked throughout. Set aside.',NULL),(3,4,'For the sauce, place a frying pan over a medium heat and add the oil.',NULL),(3,5,'Sauté the garlic until fragrant, then fry the peppers until soften.',NULL),(3,6,'Add in the pineapple and warm thorough.',NULL),(3,7,'Add the sugar, vinegar, and ketchup, stir. Bring the mixture to a boil.',NULL),(3,8,'Add the pork to the frying pan and coat everything evenly with the sauce.',NULL),(4,0,'(Source: goodhousekeeping.com) In a large bowl, whisk together eggs, Dijon mustard, 1 tablespoon water and 1/2 teaspoon each salt and pepper.',NULL),(4,1,'Heat oil or butter in 10-inch nonstick skillet on medium. Add eggs and cook, stirring with rubber spatula every few seconds, to desired doneness, 2 to 3 minutes for medium-soft eggs. Fold in bacon, spinach, and Gruyère cheese.',NULL),(5,0,'(Source: goodhousekeeping.com) In a blender, add ingredients in the order they are listed. Purée ingredients until smooth.',NULL),(6,0,'(Source: delish.com) In a small bowl, combine butter and herbs. Place in center of a piece of plastic wrap and roll into a log. Twist ends together to keep tight and refrigerate until hardened, 20 minutes. ',NULL),(6,1,'Season steak on both sides with salt and pepper. ',NULL),(6,2,'Place steak in basket of air fryer and cook at 400° for 12 to 14 minutes, for medium, depending on thickness of steak, flipping halfway through. ',NULL),(6,3,'Top steak with a slice of herb butter to serve. ',NULL),(7,0,' Preheat oven to 475º F. Drizzle 12-inch cast iron skillet with olive oil. Press pizza dough into the bottom of the skillet, creating a bit of an edge up the side of the skillet.',NULL),(7,1,'Spread pizza sauce on the pizza dough and layer with Mozzarella cheese and tomato slice. Drizzle with olive oil and sprinkle with salt and pepper.',NULL),(7,2,'Bake until edges of crust have browned and pizza has cooked throughout, about 15 minutes. Remove from oven and allow to rest for about 5 minutes.',NULL),(7,3,'Arrange basil leaves on top of pizza, slice and serve.',NULL),(8,0,'(Source: delicious.com) Heat oil in a wok over medium-high heat. Add garlic and cook for 2-3 minutes until golden. Remove using a slotted spoon and set aside. Add pork to the garlic oil in the wok and cook, breaking up mince with a wooden spoon, for 6-7 minutes until lightly caramelised. Add chilli bean sauce and cook for 2 minutes or until lightly caramelised. Add chives and rice and cook, tossing in the pan, for 3 minutes or until coloured. To serve, top with fried eggs and scatter with crisp garlic. ',NULL),(9,0,'Put the potatoes in a large saucepan of salted water and bring to the boil over a high heat. Cook for 20-25 minutes until the potatoes are tender but not falling apart, then drain well.',NULL),(9,1,'Meanwhile, roughly chop the capers on a board. Add the parsley leaves and continue chopping. Finally add the garlic and continue to chop until you have an almost paste-like mixture. Transfer to a bowl and add the lemon zest, then set aside (see Make Ahead).',NULL),(9,2,'Put the potatoes on a flat surface. Using something flat, such as a plate or the bottom of a pan, gently squash the potatoes. Don’t completely crush them – you want them to mostly hold their shape.',NULL),(9,3,'Heat the olive oil in a large frying pan over a medium heat, add the potatoes to the hot oil and fry for around 10 minutes, turning occasionally, until golden and crunchy. Scatter over the parsley mixture and gently move the potatoes around so they’re coated and the capers become a little crispy. Serve (see tip).',NULL),(10,0,'(Source: tasteofhome.com) In a large bowl, dissolve yeast in warm water. Add oil, salt and 2 cups flour. Beat on medium speed for 3 minutes. Stir in enough remaining flour to form a soft dough. Turn onto a floured surface; knead until smooth and elastic, about 6-8 minutes. Place in a greased bowl, turning once to grease top. Cover and let rest in a warm place for 10 minutes.',NULL),(10,1,'Combine sauce ingredients; set aside. Divide dough in half. On a floured surface, roll each portion into a 13-in. circle. Transfer to two greased 12-in. pizza pans; build up edges slightly. ',NULL),(10,2,'Bake at 375° for 15 minutes or until lightly browned. Spread with sauce; sprinkle with toppings. Bake for 15-20 minutes or until cheese is melted.',NULL),(12,0,'(Source: bbcgoodfood.com) To make the filling, heat the oven to 160C/140C fan/gas 3. Heat half the oil in a large casserole dish, brown the meat really well in batches, then set aside. Add the onions adding a drizzle more oil, then cook on a low heat for 5 mins until coloured.',NULL),(12,1,'Scatter over the flour, stirring until the flour turns brown. Tip the meat and any juices back into the pan along with the ketchup and give it all a good stir. Pour over the stock, season, and bring to a simmer then cover with a lid and put in the oven for about 2 hrs, until the meat is tender. The filling can be made up to three days ahead and chilled or frozen for up to three months.',NULL),(12,2,'To make the pie, heat the oven to 220C/200C fan/gas 7. Tip the filling into a 24-26cm rimmed pie dish and brush the rim of the dish with some yolk. Unravel the pastry, drape over the dish and use a knife to trim and press the edges against the side of the dish. Re-roll your trimmings to make a decoration if you like. Brush the pie heavily with egg yolk. Make a few little slits in the centre of the pie and bake for 40 mins until golden. Leave to stand for a few minutes before serving.',NULL),(13,0,'In a medium-sized bowl, add the flour and salt. Mix with fork until combined.',NULL),(13,1,'Add in cubed butter and break up into flour with a fork. Mixture will still have lumps about the size of small peas.',NULL),(13,2,'Gradually add the ice water and continue to mix until the dough starts to come together. You may not need all of the water, but if the dough is too dry then add more. The dough should not be very tacky or sticky.',NULL),(13,3,'Work the dough together with your hands and turn out onto a surface. Work into a ball and cover with cling wrap. Refrigerate.',NULL),(13,4,'Peel the apples, then core and slice.',NULL),(13,5,'In a bowl, add the sliced apples, sugar, flour, salt, cinnamon, nutmeg, and juice from the lemon.',NULL),(13,6,'Mix until combined and all apples are coated. Refrigerate.',NULL),(13,7,'Preheat the oven to 375°F (200°C).',NULL),(13,8,'On a floured surface, cut the pie dough in half and roll out both halves until round and about ⅛-inch (3 mm) thick.',NULL),(13,9,'Roll the dough around the rolling pin and unroll onto a pie dish making sure the dough reaches all edges. Trim extra if necessary.',NULL),(13,10,'Pour in apple filling mixture and pat down.',NULL),(13,11,'Roll the other half of the dough on top.',NULL),(13,12,'Trim the extra dough from the edges and pinch the edges to create a crimp. Make sure edges are sealed together.',NULL),(13,13,'Brush the pie with the beaten egg and sprinkle with the sugar.',NULL),(13,14,'Cut four slits in the top of the pie to create a vent.',NULL),(13,15,'Bake pie for 50-60 minutes or until the crust is golden brown and no greyish or undercooked pastry remains.',NULL),(13,16,'Allow to cool completely before slicing.',NULL),(13,17,'Top with ice cream and serve.',NULL),(14,0,'(Source: kitchensancturoy.com) Preheat the oven to 200c/400f.',NULL),(14,1,'Line a 10 x 8 inch pie dish with one roll of the puff pastry.',NULL),(14,2,'Prick the base several times with a fork and cut off any large overhanging bits of pastry.',NULL),(14,3,'Line the pastry with baking parchment so that it completely covers the pastry, then fill with baking beans (or dried beans) and place in the oven to \'blind bake\' for 10 minutes. PRO TIP This helps to prevent the pie having a soggy bottom. Because it\'s puff pastry the sides will puff up a bit (which I don\'t mind), if you want to prevent this, just fill up with more baking beans.',NULL),(14,4,'Take out of the oven and put to one side.',NULL),(14,5,'Meanwhile, place the chicken, carrots, potatoes, salt, pepper, thyme and stock to a large saucepan. ',NULL),(14,6,'Bring to the boil and allow to simmer for 15 minutes and then turn off the heat.',NULL),(14,7,'When the chicken and stock is nearly cooked, take another large sauce pan and add in the butter and chopped onion. Heat on medium and cook the onion for about 5-6 minutes until soft.',NULL),(14,8,'Add in the flour and mix it into the onions and butter using a balloon whisk. It should form into a creamy paste (or roux). Allow the roux to cook for a minute whilst stirring with your whisk.',NULL),(14,9,'Then add in a ladle of the stock from the chicken broth (try to get mostly stock - not the chicken/veggies). Stir the broth into the mixture using the whisk. Repeat this until you have ladled out most of the stock from the chicken pan (leaving the chicken and veggies behind). ',NULL),(14,10,'Now pour in the milk. Heat through whilst stirring with the whisk. The sauce should thicken as it is heating.',NULL),(14,11,'Once the sauce is almost at boiling (don\'t let it boil) add in the chicken and veggies.',NULL),(14,12,'Bring back to almost boiling and add in half the lemon juice. Give it a stir and taste. Add the rest of the lemon juice and a more seasoning if you think it needs it.',NULL),(14,13,'Remove the baking beans and baking parchment from the pie and fill the pie up with the chicken mixture.',NULL),(14,14,'Brush the edges of the pastry with egg wash, then top the pie with the remaining piece of pastry.',NULL),(14,15,'Pinch the edges to seal, then brush the top with more egg wash and pierce a couple of small holes in the top of the pie with a sharp knife.',NULL),(14,16,'Place back in the oven (still at 200c/400f) and cook for 20-25 minutes until golden brown.',NULL),(14,17,'Serve immediately with some green veg.',NULL),(16,0,'Tip the beef stock along with 500ml of water into a large saucepan. Sit the onion and ginger in a frying pan over a high heat and char on all sides, around 3-5 mins (you can also do this under your grill). Once charred, add to the beef stock. In the same pan, toast the spices for 2-3 mins and once they begin to smell fragrant, add them to the beef stock as well. Bring the stock to the boil, then turn to a simmer and cook for 30mins before straining.',NULL),(16,1,'Meanwhile, cut the fat from the steak and wrap in cling film, then put into the freezer for 15 mins – this will make your steak really easy to slice! Slice it thinly, then cover with cling film again and pop into the fridge.',NULL),(16,2,'Taste the beef stock and use the palm sugar, fish sauce and soy to season. Cook the noodles according to package instructions and split between two bowls, topping each with the sliced beef. Bring the stock to the boil and then pour into the bowls (the heat will cook the beef). Top each with the spring onions, chilli slices and herbs. Serve with the lime wedges to squeeze over.',NULL);
/*!40000 ALTER TABLE `RecipeSteps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Recipes`
--

DROP TABLE IF EXISTS `Recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Recipes` (
  `recipe_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_by_user_id` int DEFAULT NULL,
  `creation_time` timestamp NULL DEFAULT NULL,
  `edit_time` timestamp NULL DEFAULT NULL,
  `time_to_cook` int DEFAULT NULL,
  `name` text,
  `type` text,
  `serving_size` int DEFAULT NULL,
  `description` text,
  `calories` int DEFAULT NULL,
  `likes` int DEFAULT '0',
  PRIMARY KEY (`recipe_id`),
  UNIQUE KEY `recipe_id` (`recipe_id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Recipes`
--

LOCK TABLES `Recipes` WRITE;
/*!40000 ALTER TABLE `Recipes` DISABLE KEYS */;
INSERT INTO `Recipes` VALUES (1,2,'2021-07-13 16:48:19','2021-07-16 17:48:29',120,'Spaghetti Bolognese','Dinner',6,'Super easy and a true Italian classic with a meaty, chilli sauce. This recipe comes courtesy of BBC Good Food user Andrew Balmer',600,3),(2,2,'2021-07-13 16:52:52','2021-07-16 16:56:11',30,'The Classic Burger','Lunch',4,'Delicious restaurant-style, hamburger recipe',600,1),(3,2,'2021-07-13 16:56:56','2021-07-17 00:18:52',30,'Sweet and Sour Pork','Dinner',4,'Loaded with tricks the Chinese have been using for centuries',1600,1),(4,4,'2021-07-13 17:06:46','2021-07-13 17:10:03',10,'Gruyère, Bacon, and Spinach Scrambled Eggs','Breakfast',4,'A great way to start the day',300,2),(5,4,'2021-07-13 17:11:24',NULL,5,'Super Simple Summer Smoothie','Snack',2,'Refreshing summer drink',100,0),(6,4,'2021-07-13 17:14:54',NULL,45,'Air Fryer Steak','Dinner',2,'Hearty meal for 2',300,0),(7,2,'2021-07-14 21:44:06','2021-07-16 16:31:02',30,'Margherita Pizza','Lunch',2,'Classic pizza',400,0),(8,5,'2021-07-14 21:48:49',NULL,15,' Garlicky fried rice with crisp pork','Dinner',4,'Fried rice with innovative ingredients',600,0),(9,5,'2021-07-14 21:53:40',NULL,45,'BEST fried potatoes','Lunch',4,'The BEST fried potatoes',300,1),(10,2,'2021-07-16 04:14:34','2021-07-16 16:31:10',75,'Pizza Supreme','Lunch',4,'Easy to work with and the crust is so good',900,1),(12,2,'2021-07-17 01:23:18','2021-07-17 02:12:29',200,'Easy steak pie','Lunch',6,'Homemade steak pie, complete with golden-brown flaky pastry and a rich filling. ',900,1),(13,2,'2021-07-17 01:33:41',NULL,60,'Apple Pie','Snack',8,NULL,500,1),(14,6,'2021-07-17 02:08:54','2021-07-17 02:14:03',105,'Creamy Chicken Pot Pie','Lunch',6,'This Creamy Chicken pot pie with puff pastry and vegetables is comfort food bliss! ',900,0),(16,6,'2021-07-17 22:03:43','2021-07-17 22:06:09',70,'Beef pho','Lunch',2,'Full of classic Asian flavours along with sirloin steak and noodles',500,1);
/*!40000 ALTER TABLE `Recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SearchHistory`
--

DROP TABLE IF EXISTS `SearchHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SearchHistory` (
  `user_id` int NOT NULL,
  `search_term` text,
  `time` timestamp NOT NULL,
  PRIMARY KEY (`user_id`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SearchHistory`
--

LOCK TABLES `SearchHistory` WRITE;
/*!40000 ALTER TABLE `SearchHistory` DISABLE KEYS */;
INSERT INTO `SearchHistory` VALUES (2,'yes','2021-07-18 22:43:27'),(2,'fry','2021-07-18 22:44:09'),(2,'spaghetti','2021-07-18 23:02:18'),(2,'cook','2021-07-18 23:02:32'),(2,'a','2021-07-19 22:13:25'),(2,'oil','2021-07-20 01:03:22'),(2,'pie','2021-07-20 01:03:53'),(2,'beef','2021-07-27 20:17:04'),(2,'pig','2021-07-28 01:52:04'),(2,'pizza','2021-07-29 21:30:11'),(3,'beef','2021-07-20 20:11:38'),(3,'yeds','2021-07-21 19:52:33'),(3,'pie','2021-07-21 19:52:42'),(3,'steak pie','2021-07-21 19:52:43'),(3,'eargeagrearg','2021-07-22 17:19:30'),(4,'Smoothie','2021-07-16 21:10:35'),(4,'iuhiouhiuhiuhikhk','2021-07-24 03:41:41'),(4,'spaghetti','2021-07-29 02:56:10'),(4,'yes','2021-07-29 03:03:39'),(6,'chicken pot pie','2021-07-17 22:30:18'),(6,'chicken','2021-07-17 22:42:06'),(6,'oil','2021-07-17 22:45:14'),(6,'cow','2021-07-17 22:45:52'),(6,'spaghetti','2021-07-17 22:47:04'),(6,'fry','2021-07-17 22:47:40'),(6,'bake','2021-07-17 22:47:51'),(6,'pie','2021-07-17 22:49:32'),(6,'creamy chicken pie','2021-07-17 22:49:41'),(6,'beef','2021-07-20 20:41:49'),(6,'soup','2021-07-23 02:38:54');
/*!40000 ALTER TABLE `SearchHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubscribedTo`
--

DROP TABLE IF EXISTS `SubscribedTo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SubscribedTo` (
  `user_id` int NOT NULL,
  `is_subscribed_to` int NOT NULL,
  PRIMARY KEY (`user_id`,`is_subscribed_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubscribedTo`
--

LOCK TABLES `SubscribedTo` WRITE;
/*!40000 ALTER TABLE `SubscribedTo` DISABLE KEYS */;
INSERT INTO `SubscribedTo` VALUES (2,4),(2,5),(3,2),(3,4),(4,2),(4,5),(4,6),(6,2);
/*!40000 ALTER TABLE `SubscribedTo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` text NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `password_hash` text NOT NULL,
  `profile_pic_path` text,
  `password_reset_code_hash` int DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id` (`user_id`),
  FULLTEXT KEY `first_name` (`first_name`),
  FULLTEXT KEY `last_name` (`last_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (2,'jonathan.liu@testaccount.com','Jonathan','Liu','$2b$12$5Gk5XDy6zCt.xMlTKiWsKubTrc.Qv25ux8Ds.oSHPZPVTKB5GdzYi','01e901d04035a619aa4d09a5691fd6f369f0865c.png',NULL,1),(3,'bob.smith@testaccount.com','Bob','Smith','$2b$12$9/7DefxGpHGsuGGUJ1nHRe5IWEY4oE7NmGJ6nHBwR8le5afilyA1K','47773ea7962b30d37bf2a402d35d0821adeef10e.png',NULL,1),(4,'alice.smith@testaccount.com','Alice','Smith','$2b$12$4aKV2/pHKWSlo6qr.nTeL.mXywxwbZXd9XGMWq4T4emtF//kVa1yi','a9a6bc1ba3c758ab09d3ea3bd53451911e3f4dc5.png',NULL,1),(5,'charlie.fitzgerald@testaccount.com','Charlie','Fitzgerald','$2b$12$XlIpbcpztNjLuIsxbgK9guMix7RWJWl5NHJRnFnAHGWt2sAVBbbFy','1f6c8976541b06d36e5390411c3b385894140547.png',NULL,1),(6,'dean.xue@testaccount.com','Dean','Xue','$2b$12$tfqVYQmprKJv7dg5Di8B2OdYUfg6UYFUTdUNBf8wlNu5Q7cH9Z/u6','d897889df9d162b2b79109bb5c583918b7c2c65b.png',NULL,1);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-30 21:44:22
