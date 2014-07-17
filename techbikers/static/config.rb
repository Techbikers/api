# Set the environment (defualt is development)
# environment = :development

# Show what environment we're running in, just in case
if environment == :production
    puts "Running in production mode..."
elsif environment == :development
    puts "Running in development mode..."
else
    puts "Running in an unknown mode..."
end

# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path       = (environment == :production) ? "/static/" : "http://localhost:8000/static/"
css_dir         = "css"
sass_dir        = "scss"
images_dir      = "img"
javascripts_dir = "js"
fonts_dir       = "fonts"

http_stylesheets_path = http_path + "css"
http_images_path      = http_path + "img"
http_javascripts_path = http_path + "js"
http_fonts_path       = http_path + "fonts"

relative_assets = (environment == :production) ? true : false

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = (environment == :production) ? :compressed : :nested

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false

# sass_options = { :debug_info => (environment == :production) ? false : true }


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
