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
INSERT INTO `RecipeIngredients` VALUES (1,0,'olive oil',1,'tbsp'),(1,1,'smoked streaky bacon, finely chopped',4,'rashers'),(1,2,'medium onions, finely chopped',2,NULL),(1,3,'carrots, trimmed and finely chopped',2,NULL),(1,4,' celery sticks, finely chopped',2,NULL),(1,5,'garlic cloves finely chopped',2,NULL),(1,6,'rosemary leaves picked and finely chopped',3,'sprigs '),(1,7,'beef mince',500,'g'),(1,8,'plum tomatoes',800,'g'),(1,9,'basil leaves picked, ¾ finely chopped and the rest left whole for garnish',NULL,'small pack'),(1,10,'dried oregano',1,'tsp'),(1,11,'fresh bay leaves',2,NULL),(1,12,'tomato puree',2,'tbsp'),(1,13,'beef stock cube',1,NULL),(1,14,'red chilli deseeded and finely chopped',1,NULL),(1,15,'red wine',125,'ml'),(1,16,'cherry tomatoes sliced in half',6,NULL),(1,17,'parmesan grated',75,'g'),(1,18,'spaghetti',400,'g'),(2,0,'ground lean (7% fat) beef',1,'pound'),(2,1,'large egg',1,NULL),(2,2,'minced onion',0.5,'cup'),(2,3,'fine dried bread crumbs',0.25,'cup'),(2,4,'Worcestershire',1,'tablespoon'),(2,5,'cloves garlic',2,NULL),(2,6,'salt',0.5,'teaspoon'),(2,7,'pepper',0.25,'teaspoon'),(2,8,'hamburger buns, split',4,NULL),(2,9,'mayonnaise',0.25,'cup'),(2,10,'ketchup',0.25,'cup'),(2,11,'iceberge lettuce leaves',4,NULL),(2,12,'firm-ripe tomato, thinly sliced',1,NULL),(2,13,'thin slices red onion',4,NULL),(3,0,'pork',0.5,'lb'),(3,1,'salt',1,'teaspoon'),(3,2,'corn flour',1,'teaspoon'),(3,3,'egg',1,NULL),(3,4,'corn flour',1,'cup'),(3,5,'oil',2.5,'cups'),(3,6,'oil',2,'tablespoons'),(3,7,'garlic, crushed',2,'teaspoons'),(3,8,'green bell pepper, chopped',0.5,NULL),(3,9,'pineapple',1,'cup'),(3,10,'white caster sugar',0.25,'cup'),(3,11,'rice vinegar',0.25,'cup'),(3,12,'ketchup',2,'tabespoons'),(4,0,'large eggs',8,NULL),(4,1,'Dijon mustard',1,'tsp'),(4,2,'Koscher salt and pepper',NULL,NULL),(4,3,'olive oil',1,'tbsp'),(4,4,'thick cut bacon, broken into pieces',2,'slices'),(4,5,'spinach, torn',2,'c'),(4,6,'Gruyère cheese, shredded',2,'0z'),(5,0,'milk',0.25,'cup'),(5,1,'plain yogurt',0.5,'cup'),(5,2,'fresh summer fruit',2,'cup'),(6,0,'butter, softened',4,'tbsp'),(6,1,'garlic',2,'cloves'),(6,2,'freshly chopped parsley',2,'tsp'),(6,3,'freshly chopped chives',1,'tsp'),(6,4,'freshly chopped thyme',1,'tsp'),(6,5,'fresly chopped rosemary',1,'tsp'),(6,6,'bone-in ribeye',1,NULL),(6,7,'koscher salt',NULL,NULL),(6,8,'freshly ground black pepper',NULL,NULL),(7,0,'pizza dough',0.5,NULL),(7,1,'mozerella',1.5,'cup'),(7,2,'olive oil',NULL,NULL),(7,3,'fresh basil leaves',1,'bunch'),(7,4,'salt',0.5,'teaspoon'),(7,5,'tomato sauce',1,'cup'),(8,0,'peanut oil',80,'ml'),(8,1,'garlic cloves, thinly sliced',4,NULL),(8,2,'minced pork',300,'g'),(8,3,'chilli bean sauce',0.25,'cup'),(8,4,'garlic chives, chopped',1,'bunch'),(8,5,'cooked jasmine rice',4,'cups'),(8,6,'fried eggs',NULL,NULL),(9,0,'waxy baby potatoes',700,'g'),(9,1,'capers, rinsed',1,'tbsp'),(9,2,'fresh flatleaf parsley leaves',NULL,'handful'),(9,3,'garlic clove',1,'small'),(9,4,'finely grated zest lemon',1,NULL),(9,5,'extra-virgin olive oil',3,'tbsp');
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
INSERT INTO `RecipePhotos` VALUES (1,0,'b525380467d61d8abb6f390b477c5ba8b1340a80.jpg','bolonez_soslu_makarna3.jpg'),(1,1,'d0ef551300a08aa4d8b3a787404bacd18af6536a.jpg','easy-spaghetti-bolognese-recipe-main-photo.jpg'),(1,2,'6f456946e6110f2ccb9368b5afb1c016ef81327c.jpg','Spaghetti-Bolognese-square-FS-0204.jpg'),(2,0,'dd9ae7230d1cbf3c2150ea699bee875f0d08bd12.jpg','image.jpg'),(4,0,'b6a6791be03c0ad7dc0fd9baaa984709d8f6b100.jpg','gruyere-bacon-and-spinach-scrambled-eggs-1608648723.jpg'),(5,0,'b6e83a8a654b8a98e3eecdb9ae4cbe7d289f11c3.jpg','how-to-make-a-smoothie-1601565091.jpg'),(6,0,'8658d54671c971b8252238917c57263d1ee00712.jpg','delish-190807-air-fryer-steak-0084-landscape-pf-1566237752.jpg'),(7,0,'2c370377cb7b76b1cd2be7f94a9835478a316199.jpg','pizza_1.jpeg'),(7,1,'4102a1b211e3e3ecd4c811accab64d6a4f42e63d.jpg','pizza_2.jpeg'),(7,2,'712ccd2c8d86b8e90912e5a06008c7f9c45abf94.jpg','pizza_3.jpeg'),(7,3,'7cebc2dc7b8ec712478f9f4f578ff71122bd9fb0.jpg','pizza_4.jpeg'),(8,0,'fc9af8996f1cd89d97d09ba9a1be949bdd6d9479.jpg','garlicky-fried-rice-with-crisp-pork-127604-1.jpg'),(9,0,'52c005b26556815f00c50e888a95575512c108fa.jpg','AUTUMN-best-fried-potatoes-768.jpg');
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
INSERT INTO `RecipeSteps` VALUES (1,0,'(Source BBC Good Food) Put a large saucepan on a medium heat and add 1 tbsp olive oil.',NULL),(1,1,'Add 4 finely chopped bacon rashers and fry for 10 mins until golden and crisp.',NULL),(1,2,'Reduce the heat and add the 2 onions, 2 carrots, 2 celery sticks, 2 garlic cloves and the leaves from 2-3 sprigs rosemary, all finely chopped, then fry for 10 mins. Stir the veg often until it softens.',NULL),(1,3,'Increase the heat to medium-high, add 500g beef mince and cook stirring for 3-4 mins until the meat is browned all over.',NULL),(1,4,'Add 2 tins plum tomatoes, the finely chopped leaves from ¾ small pack basil, 1 tsp dried oregano, 2 bay leaves, 2 tbsp tomato purée, 1 beef stock cube, 1 deseeded and finely chopped red chilli (if using), 125ml red wine and 6 halved cherry tomatoes. Stir with a wooden spoon, breaking up the plum tomatoes.',NULL),(1,5,'Bring to the boil, reduce to a gentle simmer and cover with a lid. Cook for 1 hr 15 mins stirring occasionally, until you have a rich, thick sauce.',NULL),(1,6,'Add the 75g grated parmesan, check the seasoning and stir.',NULL),(1,7,'When the bolognese is nearly finished, cook 400g spaghetti following the pack instructions.',NULL),(1,8,'Drain the spaghetti and either stir into the bolognese sauce, or serve the sauce on top. Serve with more grated parmesan, the remaining basil leaves and crusty bread, if you like.',NULL),(2,0,'(Source: myrecipes.com) In a bowl, mix ground beef, egg, onion, bread crumbs, Worcestershire, garlic, 1/2 teaspoon salt, and 1/4 teaspoon pepper until well blended. Divide mixture into four equal portions and shape each into a patty about 4 inches wide.',NULL),(2,1,'Lay burgers on an oiled barbecue grill over a solid bed of hot coals or high heat on a gas grill (you can hold your hand at grill level only 2 to 3 seconds); close lid on gas grill. Cook burgers, turning once, until browned on both sides and no longer pink inside (cut to test), 7 to 8 minutes total. Remove from grill.',NULL),(2,2,'Lay buns, cut side down, on grill and cook until lightly toasted, 30 seconds to 1 minute.',NULL),(2,3,'Spread mayonnaise and ketchup on bun bottoms. Add lettuce, tomato, burger, onion, and salt and pepper to taste. Set bun tops in place.',NULL),(3,0,'(Source: tasty.co) In a bowl, combine all marinade ingredients with the pork. Cover and leave to marinade in the fridge 20 minutes.',NULL),(3,1,'Place the corn flour in a large bowl and toss the marinated pork chunks until liberally coated.',NULL),(3,2,'In a medium-sized saucepan, heat the oil to 350˚F (180°C).',NULL),(3,3,'Deep fry the pork pieces for about 3-4 minutes until the coating is golden brown and the pork is cooked throughout. Set aside.',NULL),(3,4,'For the sauce, place a frying pan over a medium heat and add the oil.',NULL),(3,5,'Sauté the garlic until fragrant, then fry the peppers until soften.',NULL),(3,6,'Add in the pineapple and warm thorough.',NULL),(3,7,'Add the sugar, vinegar, and ketchup, stir. Bring the mixture to a boil.',NULL),(3,8,'Add the pork to the frying pan and coat everything evenly with the sauce.',NULL),(4,0,'(Source: goodhousekeeping.com) In a large bowl, whisk together eggs, Dijon mustard, 1 tablespoon water and 1/2 teaspoon each salt and pepper.',NULL),(4,1,'Heat oil or butter in 10-inch nonstick skillet on medium. Add eggs and cook, stirring with rubber spatula every few seconds, to desired doneness, 2 to 3 minutes for medium-soft eggs. Fold in bacon, spinach, and Gruyère cheese.',NULL),(5,0,'(Source: goodhousekeeping.com) In a blender, add ingredients in the order they are listed. Purée ingredients until smooth.',NULL),(6,0,'(Source: delish.com) In a small bowl, combine butter and herbs. Place in center of a piece of plastic wrap and roll into a log. Twist ends together to keep tight and refrigerate until hardened, 20 minutes. ',NULL),(6,1,'Season steak on both sides with salt and pepper. ',NULL),(6,2,'Place steak in basket of air fryer and cook at 400° for 12 to 14 minutes, for medium, depending on thickness of steak, flipping halfway through. ',NULL),(6,3,'Top steak with a slice of herb butter to serve. ',NULL),(7,0,' Preheat oven to 475º F. Drizzle 12-inch cast iron skillet with olive oil. Press pizza dough into the bottom of the skillet, creating a bit of an edge up the side of the skillet.',NULL),(7,1,'Spread pizza sauce on the pizza dough and layer with Mozzarella cheese and tomato slice. Drizzle with olive oil and sprinkle with salt and pepper.',NULL),(7,2,'Bake until edges of crust have browned and pizza has cooked throughout, about 15 minutes. Remove from oven and allow to rest for about 5 minutes.',NULL),(7,3,'Arrange basil leaves on top of pizza, slice and serve.',NULL),(8,0,'(Source: delicious.com) Heat oil in a wok over medium-high heat. Add garlic and cook for 2-3 minutes until golden. Remove using a slotted spoon and set aside. Add pork to the garlic oil in the wok and cook, breaking up mince with a wooden spoon, for 6-7 minutes until lightly caramelised. Add chilli bean sauce and cook for 2 minutes or until lightly caramelised. Add chives and rice and cook, tossing in the pan, for 3 minutes or until coloured. To serve, top with fried eggs and scatter with crisp garlic. ',NULL),(9,0,'Put the potatoes in a large saucepan of salted water and bring to the boil over a high heat. Cook for 20-25 minutes until the potatoes are tender but not falling apart, then drain well.',NULL),(9,1,'Meanwhile, roughly chop the capers on a board. Add the parsley leaves and continue chopping. Finally add the garlic and continue to chop until you have an almost paste-like mixture. Transfer to a bowl and add the lemon zest, then set aside (see Make Ahead).',NULL),(9,2,'Put the potatoes on a flat surface. Using something flat, such as a plate or the bottom of a pan, gently squash the potatoes. Don’t completely crush them – you want them to mostly hold their shape.',NULL),(9,3,'Heat the olive oil in a large frying pan over a medium heat, add the potatoes to the hot oil and fry for around 10 minutes, turning occasionally, until golden and crunchy. Scatter over the parsley mixture and gently move the potatoes around so they’re coated and the capers become a little crispy. Serve (see tip).',NULL);
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
  PRIMARY KEY (`recipe_id`),
  UNIQUE KEY `recipe_id` (`recipe_id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Recipes`
--

LOCK TABLES `Recipes` WRITE;
/*!40000 ALTER TABLE `Recipes` DISABLE KEYS */;
INSERT INTO `Recipes` VALUES (1,2,'2021-07-13 16:48:19',NULL,120,'Spaghetti Bolognese','Dinner',6),(2,2,'2021-07-13 16:52:52','2021-07-13 16:53:15',30,'The Classic Burger','Lunch',4),(3,2,'2021-07-13 16:56:56','2021-07-13 16:57:16',30,'Sweet and Sour Pork','Dinner',2),(4,4,'2021-07-13 17:06:46','2021-07-13 17:10:03',10,'Gruyère, Bacon, and Spinach Scrambled Eggs','Breakfast',4),(5,4,'2021-07-13 17:11:24',NULL,5,'Super Simple Summer Smoothie','Snack',2),(6,4,'2021-07-13 17:14:54',NULL,45,'Air Fryer Steak','Dinner',2),(7,2,'2021-07-14 21:44:06',NULL,30,'Margherita Pizza','Lunch',2),(8,5,'2021-07-14 21:48:49',NULL,15,' Garlicky fried rice with crisp pork','Dinner',4),(9,5,'2021-07-14 21:53:40',NULL,45,'BEST fried potatoes','Lunch',4);
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
INSERT INTO `SearchHistory` VALUES (2,'Smoothie','2021-07-14 19:57:34'),(2,'cake','2021-07-14 19:57:48'),(2,'burger','2021-07-14 19:57:51'),(2,'dog','2021-07-14 19:58:02'),(2,'yes','2021-07-14 20:18:28'),(2,'aaaaaa','2021-07-14 20:53:58'),(2,'pizza','2021-07-14 20:54:04'),(2,NULL,'2021-07-14 21:49:02');
/*!40000 ALTER TABLE `SearchHistory` ENABLE KEYS */;
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
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'test@test.com','Test','Account','testing',NULL,NULL,NULL),(2,'jonathan.liu2000@gmail.com','Jonathan','Liu','$2b$12$FMdSIcVEDqkOPz90ffrgheqlhcAmy8vKij.AAVeByKQ9D9V0aJn9.','36c70c4eb49a33110b9fe413caa05b29741f9001.png',NULL,1),(3,'jliu2212@hotmail.com','Bob','Smith','$2b$12$9/7DefxGpHGsuGGUJ1nHRe5IWEY4oE7NmGJ6nHBwR8le5afilyA1K','47773ea7962b30d37bf2a402d35d0821adeef10e.png',NULL,1),(4,'jonathan.liu1@student.unsw.edu.au','Alice','Smith','$2b$12$4aKV2/pHKWSlo6qr.nTeL.mXywxwbZXd9XGMWq4T4emtF//kVa1yi','a9a6bc1ba3c758ab09d3ea3bd53451911e3f4dc5.png',NULL,1),(5,'myrecipes.supp@gmail.com','Charlie','Fitzgerald','$2b$12$XlIpbcpztNjLuIsxbgK9guMix7RWJWl5NHJRnFnAHGWt2sAVBbbFy','1f6c8976541b06d36e5390411c3b385894140547.png',NULL,1);
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

-- Dump completed on 2021-07-15 17:54:34
