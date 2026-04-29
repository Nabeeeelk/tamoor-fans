import bpy
import math
import os
from mathutils import Vector

# ----------------------------
# Output path
# ----------------------------
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
except NameError:
    BASE_DIR = os.getcwd()

# Save to public/models directory for the website
OUT_PATH = os.path.join(BASE_DIR, "..", "public", "models", "wooden_fan.glb")

# Ensure directory exists
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

# ----------------------------
# Clear scene
# ----------------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()

# ----------------------------
# Helpers
# ----------------------------
def clamp(v):
    return max(0.0, min(1.0, v))

def finish_obj(obj, material=None, smooth=True):
    if material is not None and hasattr(obj.data, "materials"):
        obj.data.materials.append(material)

    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    if smooth:
        try:
            bpy.ops.object.shade_smooth()
        except Exception:
            pass

    obj.select_set(False)
    return obj

def make_material(name, base_color, metallic=0.0, roughness=0.5, image=None):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = base_color
    mat.use_nodes = True

    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")

    if bsdf:
        if "Base Color" in bsdf.inputs:
            bsdf.inputs["Base Color"].default_value = base_color
        if "Metallic" in bsdf.inputs:
            bsdf.inputs["Metallic"].default_value = metallic
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = roughness

        if image:
            tex = nodes.new(type="ShaderNodeTexImage")
            tex.name = "Wood Grain Texture"
            tex.image = image
            links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])

    return mat

def local_to_world(angle, x, y, z=0.0):
    ca = math.cos(angle)
    sa = math.sin(angle)
    return Vector((x * ca - y * sa, x * sa + y * ca, z))

def add_cylinder(name, radius, depth, location, material, vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location
    )
    obj = bpy.context.object
    obj.name = name
    finish_obj(obj, material, True)

    try:
        obj.modifiers.new("Weighted Normals", "WEIGHTED_NORMAL")
    except Exception:
        pass

    return obj

def add_uv_sphere(name, location, scale, material):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=72,
        ring_count=24,
        radius=1.0,
        location=location
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    finish_obj(obj, material, True)
    return obj

def add_torus(name, major_radius, minor_radius, location, material):
    bpy.ops.mesh.primitive_torus_add(
        major_segments=96,
        minor_segments=16,
        major_radius=major_radius,
        minor_radius=minor_radius,
        location=location
    )
    obj = bpy.context.object
    obj.name = name
    finish_obj(obj, material, True)
    return obj

def add_beveled_box(name, location, angle, dimensions, material, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add(
        size=1.0,
        location=location,
        rotation=(0.0, 0.0, angle)
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = (
        dimensions[0] / 2.0,
        dimensions[1] / 2.0,
        dimensions[2] / 2.0
    )

    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    finish_obj(obj, material, True)

    bevel_mod = obj.modifiers.new("Rounded Bevel", "BEVEL")
    bevel_mod.width = bevel
    bevel_mod.segments = 5

    try:
        obj.modifiers.new("Weighted Normals", "WEIGHTED_NORMAL")
    except Exception:
        pass

    return obj

def cylinder_between(name, p1, p2, radius, material):
    p1 = Vector(p1)
    p2 = Vector(p2)
    mid = (p1 + p2) * 0.5
    direction = p2 - p1
    length = direction.length

    if length <= 0.0001:
        return None

    bpy.ops.mesh.primitive_cylinder_add(
        vertices=32,
        radius=radius,
        depth=length,
        location=mid
    )

    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()

    finish_obj(obj, material, True)

    try:
        obj.modifiers.new("Weighted Normals", "WEIGHTED_NORMAL")
    except Exception:
        pass

    return obj

# ----------------------------
# Procedural wood texture
# ----------------------------
def create_wood_texture(width=1024, height=512):
    img = bpy.data.images.new(
        "reddish_brown_wood_grain",
        width=width,
        height=height,
        alpha=True
    )

    pixels = [0.0] * width * height * 4

    for y in range(height):
        v = y / max(1, height - 1)

        for x in range(width):
            u = x / max(1, width - 1)

            # Wavy vertical grain
            cu = (
                u
                + 0.045 * math.sin(10.0 * v + 3.0 * math.sin(5.0 * u))
                + 0.018 * math.sin(31.0 * v)
            )

            line1 = abs(math.sin(55.0 * cu + 9.0 * math.sin(7.0 * v)))
            line2 = abs(math.sin(125.0 * cu + 12.0 * math.sin(15.0 * v)))

            dark = max(0.0, (0.18 - line1) / 0.18) * 0.55
            dark += max(0.0, (0.10 - line2) / 0.10) * 0.28

            # A few knot-like darker zones
            knots = [
                (0.35, 0.32, 0.08),
                (0.66, 0.70, 0.10),
                (0.52, 0.52, 0.06),
            ]

            for ku, kv, kr in knots:
                du = u - ku
                dv = (v - kv) * 0.55
                d = math.sqrt(du * du + dv * dv)
                if d < kr:
                    dark += (1.0 - d / kr) * 0.25

            long_var = 0.88 + 0.12 * math.sin(16.0 * v + 2.0 * math.sin(13.0 * u))

            r = 0.52 * long_var - 0.23 * dark
            g = 0.25 * long_var - 0.12 * dark
            b = 0.12 * long_var - 0.07 * dark

            # Slight varnish-like warm highlight variation
            highlight = 0.025 * math.sin(70.0 * v + 5.0 * math.sin(9.0 * u))
            r += highlight
            g += highlight * 0.5

            idx = (y * width + x) * 4
            pixels[idx + 0] = clamp(r)
            pixels[idx + 1] = clamp(g)
            pixels[idx + 2] = clamp(b)
            pixels[idx + 3] = 1.0

    img.pixels.foreach_set(pixels)
    img.update()

    try:
        img.pack()
    except Exception:
        pass

    return img

wood_image = create_wood_texture()

wood_mat = make_material(
    "glossy reddish brown wood",
    base_color=(0.48, 0.22, 0.11, 1.0),
    metallic=0.0,
    roughness=0.32,
    image=wood_image
)

dark_wood_mat = make_material(
    "dark wood grooves",
    base_color=(0.12, 0.055, 0.028, 1.0),
    metallic=0.0,
    roughness=0.45
)

black_metal_mat = make_material(
    "dark black metal",
    base_color=(0.015, 0.014, 0.013, 1.0),
    metallic=0.45,
    roughness=0.28
)

# ----------------------------
# Blade mesh
# ----------------------------
def create_blade(name, angle, material):
    root_offset = 0.58
    length = 4.45
    root_width = 0.50
    tip_width = 0.78
    thickness = 0.075
    pitch = math.radians(5.5)

    outline = []

    side_steps = 14
    tip_segments = 20

    r_tip = tip_width / 2.0
    y_tip_center = root_offset + length - r_tip

    # Left side
    for k in range(side_steps + 1):
        t = k / side_steps
        y = root_offset + t * (length - r_tip)
        w = root_width + t * (tip_width - root_width)
        outline.append((-w / 2.0, y))

    # Rounded tip
    for k in range(1, tip_segments + 1):
        theta = math.pi - math.pi * k / tip_segments
        x = r_tip * math.cos(theta)
        y = y_tip_center + r_tip * math.sin(theta)
        outline.append((x, y))

    # Right side
    for k in range(side_steps - 1, -1, -1):
        t = k / side_steps
        y = root_offset + t * (length - r_tip)
        w = root_width + t * (tip_width - root_width)
        outline.append((w / 2.0, y))

    verts = []
    tan_pitch = math.tan(pitch)

    # Top surface
    for x, y in outline:
        verts.append((x, y, thickness / 2.0 + x * tan_pitch))

    # Bottom surface
    for x, y in outline:
        verts.append((x, y, -thickness / 2.0 + x * tan_pitch))

    n = len(outline)

    faces = []
    faces.append(list(reversed(range(n))))       # top
    faces.append([n + i for i in range(n)])      # bottom

    for i in range(n):
        j = (i + 1) % n
        faces.append([i, j, n + j, n + i])

    mesh = bpy.data.meshes.new(name + "_mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.validate()
    mesh.update()

    # UV mapping for wood grain along the blade length
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vertex_index = mesh.loops[loop_idx].vertex_index
            co = mesh.vertices[vertex_index].co

            u = 0.5 + co.x / (tip_width * 1.15)
            v = (co.y - root_offset) / length

            uv_layer.data[loop_idx].uv = (clamp(u), clamp(v))

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.rotation_euler = (0.0, 0.0, angle)
    obj.data.materials.append(material)

    bevel = obj.modifiers.new("soft rounded blade edge", "BEVEL")
    bevel.width = 0.035
    bevel.segments = 6

    try:
        obj.modifiers.new("Weighted Normals", "WEIGHTED_NORMAL")
    except Exception:
        pass

    return obj

# ----------------------------
# Central motor body
# ----------------------------
add_cylinder(
    "round wooden motor core",
    radius=0.78,
    depth=0.50,
    location=(0, 0, 0.03),
    material=wood_mat,
    vertices=96
)

add_uv_sphere(
    "upper wooden motor dome",
    location=(0, 0, 0.30),
    scale=(0.78, 0.78, 0.24),
    material=wood_mat
)

add_uv_sphere(
    "lower wooden motor dome",
    location=(0, 0, -0.26),
    scale=(0.74, 0.74, 0.24),
    material=wood_mat
)

add_uv_sphere(
    "rounded lower wooden cap",
    location=(0, 0, -0.50),
    scale=(0.43, 0.43, 0.22),
    material=wood_mat
)

# Dark decorative rings on motor
for z in [-0.12, 0.02, 0.14, 0.26]:
    add_torus(
        "dark motor groove ring",
        major_radius=0.78,
        minor_radius=0.018,
        location=(0, 0, z),
        material=dark_wood_mat
    )

add_torus(
    "lower black metal trim ring",
    major_radius=0.43,
    minor_radius=0.035,
    location=(0, 0, -0.41),
    material=black_metal_mat
)

# ----------------------------
# Downrod and ceiling canopy
# ----------------------------
add_cylinder(
    "black vertical downrod",
    radius=0.07,
    depth=1.30,
    location=(0, 0, 1.24),
    material=black_metal_mat,
    vertices=48
)

add_cylinder(
    "upper wooden neck",
    radius=0.28,
    depth=0.24,
    location=(0, 0, 0.62),
    material=wood_mat,
    vertices=72
)

add_torus(
    "neck lower ring",
    major_radius=0.29,
    minor_radius=0.025,
    location=(0, 0, 0.49),
    material=dark_wood_mat
)

add_torus(
    "neck upper ring",
    major_radius=0.29,
    minor_radius=0.025,
    location=(0, 0, 0.74),
    material=dark_wood_mat
)

add_cylinder(
    "ceiling canopy short cylinder",
    radius=0.40,
    depth=0.12,
    location=(0, 0, 1.88),
    material=wood_mat,
    vertices=72
)

add_uv_sphere(
    "rounded ceiling canopy",
    location=(0, 0, 2.02),
    scale=(0.46, 0.46, 0.22),
    material=wood_mat
)

add_torus(
    "canopy outer lip",
    major_radius=0.40,
    minor_radius=0.025,
    location=(0, 0, 1.82),
    material=dark_wood_mat
)

add_torus(
    "canopy top ring",
    major_radius=0.31,
    minor_radius=0.018,
    location=(0, 0, 2.14),
    material=dark_wood_mat
)

# ----------------------------
# Five blades and black brackets
# ----------------------------
blade_count = 5

for i in range(blade_count):
    angle = 2.0 * math.pi * i / blade_count

    create_blade(
        name=f"wooden_blade_{i + 1}",
        angle=angle,
        material=wood_mat
    )

    # Main black clamp near blade root
    add_beveled_box(
        name=f"black_blade_root_clamp_{i + 1}",
        location=local_to_world(angle, 0.0, 1.02, -0.095),
        angle=angle,
        dimensions=(0.58, 0.56, 0.12),
        material=black_metal_mat,
        bevel=0.065
    )

    # Decorative black central foot
    add_beveled_box(
        name=f"black_hub_mount_foot_{i + 1}",
        location=local_to_world(angle, 0.0, 0.48, -0.19),
        angle=angle,
        dimensions=(0.36, 0.52, 0.14),
        material=black_metal_mat,
        bevel=0.075
    )

    # Forked metal supports
    p1 = local_to_world(angle, -0.16, 0.38, -0.17)
    p2 = local_to_world(angle, -0.23, 1.10, -0.09)
    cylinder_between(
        f"left_black_support_arm_{i + 1}",
        p1,
        p2,
        radius=0.035,
        material=black_metal_mat
    )

    p1 = local_to_world(angle, 0.16, 0.38, -0.17)
    p2 = local_to_world(angle, 0.23, 1.10, -0.09)
    cylinder_between(
        f"right_black_support_arm_{i + 1}",
        p1,
        p2,
        radius=0.035,
        material=black_metal_mat
    )

    # Small screw/bolt heads on clamps
    for sx in [-0.18, 0.18]:
        for sy in [0.92, 1.16]:
            add_cylinder(
                name=f"black_screw_{i + 1}",
                radius=0.045,
                depth=0.025,
                location=local_to_world(angle, sx, sy, -0.025),
                material=black_metal_mat,
                vertices=24
            )

# ----------------------------
# Lighting and camera
# ----------------------------
bpy.ops.object.light_add(type="AREA", location=(0, -4.5, 4.2))
light = bpy.context.object
light.name = "large softbox light"
light.data.energy = 500
light.data.size = 5.0

bpy.ops.object.camera_add(location=(0, -6.4, 2.8))
camera = bpy.context.object
camera.name = "preview camera"

target = Vector((0, 0, 0.15))
direction = target - camera.location
camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = camera

# Set origin/view settings
try:
    bpy.context.scene.view_settings.view_transform = "Filmic"
    bpy.context.scene.view_settings.look = "Medium High Contrast"
    bpy.context.scene.view_settings.exposure = 0
    bpy.context.scene.view_settings.gamma = 1
except Exception:
    pass

# ----------------------------
# Export GLB
# ----------------------------
try:
    bpy.ops.preferences.addon_enable(module="io_scene_gltf2")
except Exception:
    pass

try:
    bpy.ops.export_scene.gltf(
        filepath=OUT_PATH,
        export_format="GLB",
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_apply=True
    )
except TypeError:
    bpy.ops.export_scene.gltf(
        filepath=OUT_PATH,
        export_format="GLB"
    )

print(f"Exported GLB file to: {OUT_PATH}")
