const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pybpyxtvoghailicquxv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY non trouvé dans les variables d\'environnement');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log('🚀 Configuration de Supabase Storage...');

  try {
    // 1. Lister les buckets existants
    console.log('📋 Vérification des buckets existants...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Erreur lors de la liste des buckets:', listError);
      return;
    }

    console.log('📦 Buckets existants:', buckets?.map(b => b.name) || []);

    // 2. Vérifier si le bucket course-files existe
    const bucketExists = buckets?.some(bucket => bucket.name === 'course-files');
    
    if (bucketExists) {
      console.log('✅ Bucket "course-files" existe déjà');
    } else {
      console.log('📝 Création du bucket "course-files"...');
      
      // Note: La création de bucket via l'API client est limitée
      // Il faut le créer manuellement dans le dashboard Supabase
      console.log('⚠️  Impossible de créer le bucket via l\'API client');
      console.log('📋 Veuillez créer manuellement le bucket "course-files" dans le dashboard Supabase:');
      console.log('   1. Aller dans Storage > Buckets');
      console.log('   2. Cliquer sur "Create bucket"');
      console.log('   3. Nom: course-files');
      console.log('   4. Description: Files for courses (images, documents, etc.)');
      console.log('   5. Choisir "Public bucket"');
      console.log('   6. Cliquer sur "Create bucket"');
      return;
    }

    // 3. Tester l'upload d'un fichier de test (si le bucket existe)
    if (bucketExists) {
      console.log('🧪 Test d\'upload d\'un fichier...');
      
      const testFile = new File(['Test content'], 'test.txt', { type: 'text/plain' });
      const testPath = 'test/test-file.txt';
      
             const { error: uploadError } = await supabase.storage
         .from('course-files')
         .upload(testPath, testFile);
       
       if (uploadError) {
         console.error('❌ Erreur lors du test d\'upload:', uploadError);
       } else {
         console.log('✅ Test d\'upload réussi');
         
         // Supprimer le fichier de test
         const { error: deleteError } = await supabase.storage
           .from('course-files')
           .remove([testPath]);
        
        if (deleteError) {
          console.warn('⚠️  Impossible de supprimer le fichier de test:', deleteError);
        } else {
          console.log('🗑️  Fichier de test supprimé');
        }
      }
    }

    console.log('🎉 Configuration de Storage terminée !');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  }
}

// Exécuter la configuration
setupStorage();
