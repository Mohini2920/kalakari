// The example pieces that used to be hard-coded in the site's script.js.
// The order matters: the site's built-in fallback list uses the same ids (1-15).
const PRODUCTS = [
  ['terracotta', 'Terracotta Horse Pair (Bankura Style)', 'Hand-shaped duo with the iconic long-necked form.', 'images/tc_horse_pair.jpg'],
  ['terracotta', 'Hand-painted Terracotta Vase', 'Folk-motif face design, painted on natural clay.', 'images/tc_vase.jpg'],
  ['terracotta', 'Terracotta Tribal Couple Figurines', 'Hand-painted pair with traditional dress detailing.', 'images/tc_tribal_couple.jpg'],
  ['toda', 'Toda Embroidered Table Runner (Set of 3)', 'Fringed cotton runners with a bold central pukhoor band.', 'images/toda_runner.jpg'],
  ['toda', 'Toda Embroidered Cushion Cover', 'Red, black and cream panels with button-front closing.', 'images/toda_cushion.jpg'],
  ['toda', 'Toda Ceremonial Shawl', 'Heavier drape with dense red-and-black embroidery, worn draped.', 'images/toda_shawl2.jpg'],
  ['dhokra', 'Dhokra Elephant Diya Stand', 'Lost-wax cast elephant base holding a brass lamp stem.', 'images/dhokra_elephant_diya.jpg'],
  ['dhokra', 'Dhokra Deer Tea-Light Holders (Set of 2)', 'Pair of deer-form holders on a wooden base.', 'images/dhokra_deer_tealights.jpg'],
  ['dhokra', 'Dhokra Owl Pendant Necklace', 'Owl motif pendant on a hand-knotted stone-bead strand.', 'images/dhokra_owl_necklace.jpg'],
  ['namda', 'Namda Peacock & Tree Rug', 'Rectangular felted rug with a bold peacock-and-tree motif.', 'images/nd_peacock_rug.jpg'],
  ['namda', 'Namda Floral Mandala Rug (Round)', 'Round rug with a concentric hand-embroidered mandala.', 'images/nd_mandala_round.jpg'],
  ['namda', 'Namda Floral Runner Rug', 'Long-format runner with dense multicolour floral work.', 'images/nd_runner.jpg'],
  ['sanjhi', 'Sanjhi Tree-of-Life Framed Panel', 'Layered paper-cut tree design, framed under glass.', 'images/sj_tree_frame.jpg'],
  ['sanjhi', 'Sanjhi Hanging Lamp Shade', 'Cylindrical shade with a pierced village-scene motif.', 'images/sj_lamp_shade.jpg'],
  ['sanjhi', 'Sanjhi Krishna Swing Panel', 'Fine hand-cut Radha-Krishna scene under a flowering tree.', 'images/sj_krishna_swing.jpg'],
];

/** Insert the example pieces once, on an empty database. */
export async function seedProducts(db) {
  if (await db.get('SELECT id FROM products LIMIT 1')) return;
  await db.transaction(async (tx) => {
    for (const [i, [craft, name, description, image]] of PRODUCTS.entries()) {
      await tx.get(
        "INSERT INTO products (craft, name, description, image, status, sort_order) VALUES ($1, $2, $3, $4, 'example', $5) RETURNING id",
        [craft, name, description, image, i],
      );
    }
  });
}
