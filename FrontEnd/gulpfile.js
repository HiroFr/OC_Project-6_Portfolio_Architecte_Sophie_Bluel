const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

// Compile du SCSS au CSS
gulp.task('sass', function () {
    // A partir du dossier SASS
    return gulp.src('sass/**/*.scss')
        // Compile et Détecte si il y a une erreur
        .pipe(sass().on('error', sass.logError))
        // Ajout dans le dossier CSS
        .pipe(gulp.dest('css'))
        // Recharge la page
        .pipe(browserSync.stream());
});

// Regarde les changements de fichiers
gulp.task('serve', function () {
    //Initilasiation du serveur web à la racine du projet
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    // Regarde les changements de fichiers / recompile le SCSS si souhaité
    gulp.watch('scss/**/*.scss', gulp.series('sass'));
    // Regarde tout les fichiers HTML et recharge
    gulp.watch('*.html').on('change', browserSync.reload);
    // Regarde tout les fichiers JS dans le dossier ciblé et recharge
    gulp.watch('js/**/*.js').on('change', browserSync.reload);
});

// Tâche par défaut, appel la tâche sass en 1er puis la tâche server en 2e
gulp.task('default', gulp.series('sass', 'serve'));
